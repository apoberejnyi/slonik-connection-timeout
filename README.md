# Slonik 45.6.0 connection timeout issue

Connection pool parameter `connectionTimeout` is not applied on version 45.6.0.

Steps to reproduce:

1. Run `node ./45.6.0` - no timeout error is thrown.
1. Run `node ./31.4.2` - on an older version, timeout is thrown as expected. You can validate that the reproduction scripts are identical. The only difference is that one uses `` sql`...` ``, and another `` sql.unsafe`...` ``.
