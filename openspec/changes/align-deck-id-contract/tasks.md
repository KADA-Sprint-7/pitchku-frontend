## 1. Canonical deck identity

- [x] 1.1 Verify frontend draft creation retains a backend-compatible UUID as the project and deck ID.
- [x] 1.2 Remove the fixed placeholder UUID from PPTX export sanitisation and reject invalid deck IDs before the network request.

## 2. Verification

- [x] 2.1 Add or update tests covering preservation of a valid deck UUID and rejection of an invalid export deck ID.
- [x] 2.2 Run the relevant test suite and verify the final payload contract.
