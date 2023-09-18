import os


def bundle(mode):
	# bundles the JS code in src and puts the output in dist
	# os.chdir("./src")
	os.system(f"npx webpack --config src/Sweeper.config.js --mode={mode}")


bundle("development")
