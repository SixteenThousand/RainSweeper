Param($mode)

Invoke-Expression "npx webpack --config src/Sweeper.config.js --mode=$mode"
