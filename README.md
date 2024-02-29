# Term3-FullStackJavaScript-Sprint1

Steps to run our application...

1. Download the source code from gitHub.
2. Open a terminal and navigate to the directory you downloaded.
3. To run the program, enter "node myapp" in the terminal. This will display a welcome message along with all help for the program.
4. In order to initilize the program, you must first run "node myapp init --all". This will create the folder structure for the program and will create the configuration and help files.
5. Now, you are able to view, reset, or set the config json file. See "myapp config --help" for a list of all options.
6. Also, you are now able to create new tokens, update the phone or email associated with a token, count the tokens, list the tokens, and search for a token by entering a username, phone or email. See "myapp token --help" for a list of all options.
7. Finally, you can run the server by entering "node server" in the terminal.
8. You must then open a browser and navigate to "localhost:3000"... This will display a an interactive web form that generates a token for each new user.