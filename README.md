A Node.js command-line application modeling an intransitive dice game with cryptographically provable fairness. Each game consists of:

Fair coin toss (commit–reveal with HMAC-SHA3) to determine who picks their die first.

Die selection, with interactive help showing win-probability matrix.

Fair die rolls for both players (commit–reveal protocol for each roll).

Winner determination, with rerolls on ties.

Installation

Clone the repository:

git clone https://github.com/YOUR_USERNAME/your-repo.git
cd your-repo

Install dependencies:
npm install
