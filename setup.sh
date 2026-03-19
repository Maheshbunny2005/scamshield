#!/bin/bash
# ============================================================
# ScamShield Quick Setup Script
# Run this from the /scamshield directory
# Usage: bash setup.sh
# ============================================================

echo ""
echo "🛡️  ScamShield – Setup Script"
echo "================================"

# Install server dependencies
echo ""
echo "📦 Installing server dependencies..."
cd server && npm install
echo "✅ Server dependencies installed"

# Install client dependencies
echo ""
echo "📦 Installing client dependencies..."
cd ../client && npm install
echo "✅ Client dependencies installed"

echo ""
echo "================================"
echo "✅ Setup complete!"
echo ""
echo "To run the app:"
echo ""
echo "  Terminal 1 (server):"
echo "    cd server && npm run dev"
echo ""
echo "  Terminal 2 (client):"
echo "    cd client && npm run dev"
echo ""
echo "  Then open: http://localhost:5173"
echo "================================"
echo ""
