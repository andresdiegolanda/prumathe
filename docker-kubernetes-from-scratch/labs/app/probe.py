"""Fetch and assert a response: python probe.py URL [expected substring] [status]."""
import sys, time, urllib.request, urllib.error
url = sys.argv[1]
expected = sys.argv[2] if len(sys.argv) > 2 else ''
status = int(sys.argv[3]) if len(sys.argv) > 3 else 200
attempts = int(sys.argv[4]) if len(sys.argv) > 4 else 1
assert 1 <= attempts <= 60, 'attempts must be between 1 and 60'
for attempt in range(attempts):
    try:
        try:
            response = urllib.request.urlopen(url, timeout=5)
        except urllib.error.HTTPError as error:
            response = error
        body = response.read().decode()
        assert response.code == status, (response.code, status)
        assert expected in body, (expected, body)
        print(body, end='')
        print('PASS')
        break
    except (AssertionError, OSError):
        if attempt + 1 == attempts:
            raise
        time.sleep(1)
