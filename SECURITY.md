# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability, please send an email to:

**security@tokenizedart.xyz**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours and work with you to resolve the issue.

## Security Measures

### Smart Contracts
- OpenZeppelin audited contracts used
- Reentrancy guards on all payable functions
- Comprehensive test coverage (>90%)
- No upgradeable proxies (immutability)
- Input validation on all parameters
- Access control via Ownable pattern

### Pre-Mainnet Checklist
- [ ] Professional security audit
- [ ] Bug bounty program
- [ ] Formal verification of critical functions
- [ ] Testnet deployment and testing
- [ ] Community review period

### Best Practices
- Use hardware wallets for contract deployment
- Separate keys for testnet and mainnet
- Multi-sig for contract ownership
- Time-locked operations for critical changes
- Regular security monitoring

## Known Limitations

- Platform fee limited to 10% maximum
- Royalty percentage limited to 100%
- No pause functionality (by design for immutability)
- No upgrade mechanism (immutable contracts)

## Bug Bounty

We plan to launch a bug bounty program before mainnet deployment.

Details coming soon.

## Audit Status

⚠️ **Not yet audited** - Planned before mainnet launch

## Security Contacts

- Email: security@tokenizedart.xyz
- Discord: [Security Channel](https://discord.gg/tokenizedart)

## Acknowledgments

We appreciate responsible disclosure and will acknowledge security researchers who help improve the project.
