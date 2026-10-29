window.ENTRA_ABOUT = (() => {
  const B = en => ({en});
  const source = window.ENTRA_REFERENCE.sources;
  return {
    eyebrow: B('THE ORIENTATION'), title: B('What Microsoft Entra ID does'),
    lead: B('Identity is a starting point. A secure application carries that evidence across explicit boundaries.'),
    what: { title: B('The identity provider in the picture'), text: [
      B('Microsoft Entra is a family of identity and network access products. This course focuses on Microsoft Entra ID in a workforce tenant and the Microsoft identity platform used by applications. It does not survey every Entra product.'),
      B('Entra ID helps an organization manage identities, authenticate sign-ins and issue tokens for applications. Our Angular client uses that identity platform to obtain evidence for the Spring API. The API decides what the caller may do, and PostgreSQL enforces database privileges and row policy.'),
      B('Think of a purchase request: an employee can sign in, yet lack permission to approve it. An approver can have the right role, yet be forbidden to approve their own purchase. The distance between those statements is where this course spends its attention.')
    ], rule: B('The identity provider supplies evidence. Each resource owns its acceptance and authorization rules.'), modelNote: B('Illustrative model. Select a component to inspect its responsibility.') },
    origin: { title: B('The names and standards you will encounter'), text: [B('Older documentation often says Azure Active Directory or Azure AD. Microsoft announced the Entra ID name in 2023; that rename did not turn it into Windows Server Active Directory. OAuth and OpenID Connect are separate standards used in the application protocol.')], timeline: [
      {year: '2012', label: B('OAuth 2.0'), text: B('RFC 6749 defines the authorization framework, including authorization-code and client-credentials grants.')},
      {year: '2014', label: B('OIDC'), text: B('OpenID Connect Core 1.0 defines an identity layer on OAuth 2.0.')},
      {year: '2015', label: B('PKCE'), text: B('RFC 7636 specifies a proof-key mechanism for authorization code exchange.')},
      {year: '2023', label: B('Entra ID'), text: B('Microsoft announces the new name for Azure Active Directory.')},
      {year: '2025', label: B('OAuth BCP'), text: B('RFC 9700 records updated OAuth security best current practice.')}
    ]},
    fits: {title: B('Where it fits in this application'), intro: B('These are the responsibilities practiced by the course.'), items: [
      {title:B('Workforce sign-in'),text:B('Use a tenant identity and its applicable sign-in policies rather than collecting a company password inside the SPA.')},
      {title:B('Resource-specific access'),text:B('Acquire delegated access to an API and validate the token at that API.')},
      {title:B('Managed assignment'),text:B('Define a small app-role vocabulary and assign users through the organization\'s identity administration.')}
    ]},
    misfits: {title:B('What this course does not delegate to Entra'), intro:B('The following are design judgments of this course, not a claim that an identity product solves every application requirement.'), headers:['Requirement','Why identity evidence alone is insufficient','Where it belongs'].map(B), items:[
      {title:B('Who owns request 42?'),why:B('Record ownership is application data.'),instead:B('Validated identity plus an API/database predicate.')},
      {title:B('May a request approve itself?'),why:B('A role cannot represent every relationship and state.'),instead:B('An explicit business rule enforced atomically.')},
      {title:B('May JDBC connect?'),why:B('The database connection has a distinct principal and credential.'),instead:B('Database authentication and least-privilege grants.')},
      {title:B('Is this deployment secure?'),why:B('A successful login does not test transport, supply chain or operational controls.'),instead:B('Threat modeling and evidence from the deployed system.')}
    ]},
    decide:{title:B('Five questions before implementation'),questions:[
      'Which identities and tenants will this application accept?',
      'Which component receives each token, and which audience must it validate?',
      'What can the client do on behalf of the user, and what may that user do?',
      'How will tenant, owner and mutable state constrain every data path?',
      'What must happen when a role changes, a token expires or an identity service is unavailable?'
    ].map(B),closing:B('You do not need to know the syntax yet. You need to know which component must answer each question.'),start:B('Start with lesson 00'),back:B('See the learning path')},
    sources:{title:B('Primary references'),intro:B('Sources reviewed on'),items:[source.overview,
      ['Azure AD becomes Entra ID','https://learn.microsoft.com/en-us/entra/fundamentals/new-name'],
      ['OAuth 2.0, RFC 6749','https://www.rfc-editor.org/rfc/rfc6749.html'],
      ['OpenID Connect Core 1.0','https://openid.net/specs/openid-connect-core-1_0.html'],
      ['PKCE, RFC 7636','https://www.rfc-editor.org/rfc/rfc7636.html'],source['security-review']]}
  };
})();
