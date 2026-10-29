import { Component, Injectable, inject, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';
import { broadcastResponseToMainFrame } from '@azure/msal-browser/redirect-bridge';

type Config = { mode: 'fixture' | 'entra'; tenantId: string; spaClientId: string; apiClientId: string };
const API = 'http://localhost:18095';

@Injectable({ providedIn: 'root' })
class Identity {
  config?: Config;
  client?: PublicClientApplication;
  account = signal('No account selected');
  scenario = 'alice';
  ready = false;
  async initialize() {
    const response = await fetch('/config.json');
    if (!response.ok) throw new Error('Run node lab.mjs setup before starting the frontend.');
    this.config = await response.json() as Config;
    if (!['fixture', 'entra'].includes(this.config.mode)) throw new Error('Invalid mode');
    const health = await fetch(API + '/health').then(r => r.json());
    if (health.authMode !== this.config.mode) throw new Error('Frontend and API modes differ. Fix configuration first.');
    if (this.config.mode === 'entra') {
      this.client = new PublicClientApplication({
        auth: { clientId: this.config.spaClientId,
          authority: 'https://login.microsoftonline.com/' + this.config.tenantId,
          redirectUri: location.origin + '/redirect' },
        cache: { cacheLocation: 'sessionStorage' }
      });
      await this.client.initialize();
      const result = await this.client.handleRedirectPromise();
      if (result?.account) this.client.setActiveAccount(result.account);
      this.account.set(this.client.getActiveAccount()?.username || 'Choose Sign in');
    } else this.account.set('Alice (fixture, no sign-in performed)');
    this.ready = true;
  }
  scopes() { return ['api://' + this.config!.apiClientId + '/Requests.Read', 'api://' + this.config!.apiClientId + '/Requests.Approve']; }
  async login() {
    if (!this.client) return;
    await this.client.loginRedirect({ scopes: this.scopes(), prompt: 'select_account' });
  }
  async logout() {
    if (this.client) await this.client.logoutRedirect({ account: this.client.getActiveAccount(), postLogoutRedirectUri: location.origin });
  }
  async accessToken() {
    if (!this.ready) throw new Error('Identity is not ready.');
    if (!this.client) {
      const result = await fetch('http://localhost:18096/token?case=' + encodeURIComponent(this.scenario));
      if (!result.ok) throw new Error('Fixture token could not be issued.');
      return (await result.json()).access_token as string;
    }
    const account = this.client.getActiveAccount();
    if (!account) throw new Error('Sign in first.');
    try {
      return (await this.client.acquireTokenSilent({ scopes: this.scopes(), account })).accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        await this.client.acquireTokenRedirect({ scopes: this.scopes(), account });
      }
      throw error;
    }
  }
}

@Component({
  selector: 'course-app', standalone: true,
  template: `
  <main><header><span>PRUMATHE / REQUEST LAB</span><h1>Who may approve this?</h1>
    <p>Follow one decision from Angular to Spring to PostgreSQL.</p></header>
  <section class="identity"><strong>{{ identity.config?.mode === 'entra' ? 'Microsoft Entra mode' : 'Local fixture mode' }}</strong>
    <p>{{ identity.account() }}</p>
    @if (identity.config?.mode === 'fixture') {
      <label>Test principal or token defect <select (change)="choose($event)">
        @for (name of scenarios; track name) { <option [value]="name">{{ name }}</option> }
      </select></label><p>No person is authenticated in fixture mode. Only the API and database checks are real.</p>
    } @else {
      <button (click)="signIn()" [disabled]="busy()">Sign in</button>
      <button (click)="signOut()" [disabled]="busy()">Sign out</button>
    }
  </section><div class="grid"><section><h2>A purchase request</h2>
    <label>Request ID <input type="number" value="41" min="1" (input)="requestId = +$any($event.target).value"></label>
    <p>In the fixture: 41 belongs to Alice, 42 to Bob, 43 to another tenant.</p>
    <button (click)="call(false)" [disabled]="busy() || !identity.ready">Read request</button>
    <button (click)="call(true)" [disabled]="busy() || !identity.ready">Approve request</button>
    <p>Buttons are visible to demonstrate that the server owns authorization. A hidden button would not protect a record.</p>
  </section><section aria-live="polite"><h2>Observed response</h2><pre>{{ output() }}</pre>
    <p>401: token was not accepted. 403: an operation requirement failed. 404: no row matched this endpoint's policy. No raw tokens are displayed.</p>
  </section></div></main>`
})
class App {
  identity = inject(Identity);
  busy = signal(false);
  output = signal('Initializing identity and checking the API mode...');
  requestId = 41;
  scenarios = ['alice', 'bob', 'approver', 'wrong-audience', 'expired', 'forged', 'no-scope', 'no-role', 'other-tenant', 'app-only', 'id-token'];
  constructor() { void this.identity.initialize().then(() => this.output.set('Ready. Predict the response before sending.')).catch(e => this.output.set(e.message)); }
  choose(event: Event) { this.identity.scenario = (event.target as HTMLSelectElement).value; this.identity.account.set(this.identity.scenario + ' (fixture)'); }
  async signIn() { try { await this.identity.login(); } catch (e) { this.output.set(String(e)); } }
  async signOut() { try { await this.identity.logout(); } catch (e) { this.output.set(String(e)); } }
  async call(approve: boolean) {
    this.busy.set(true);
    try {
      const token = await this.identity.accessToken();
      // The destination is fixed. Never attach bearer tokens to arbitrary URLs.
      const response = await fetch(API + '/api/requests/' + this.requestId + (approve ? '/approve' : ''), {
        method: approve ? 'POST' : 'GET', headers: { Authorization: 'Bearer ' + token }
      });
      const body = await response.text();
      this.output.set('HTTP ' + response.status + '\n' + (body || '(no response body)'));
    } catch (e) { this.output.set(String(e)); }
    finally { this.busy.set(false); }
  }
}

// MSAL v5 requires this separate, unguarded callback path. Do not bootstrap the app here.
if (location.pathname === '/redirect') {
  void broadcastResponseToMainFrame().catch(() => {
    document.body.textContent = 'Sign-in callback failed. Return to the application and try again.';
  });
} else void bootstrapApplication(App);
