# mattermost-plugin-chess
Chess plugin for Mattermost

![screenshot](https://user-images.githubusercontent.com/36939751/64083483-51e4bc00-cce6-11e9-8dbd-c358588f279f.png)

This plugin allows Mattermost users to have their conversations over a game of chess.

#### Installation
- Download the .tar.gz bundle from https://github.com/MatthewDorner/mattermost-plugin-chess/releases/download/v1.2.1/com.matthewdorner.mattermost-plugin-chess-1.2.1.tar.gz.
- In your server's `config.json` file, set `PluginSettings.EnableUploads` to `true`. Restart server if necessary.
- Upload the plugin bundle from your Mattermost System Console -> Plugin Management page.
- You should see the plugin appear in the Plugin Management page under Installed Plugins.
- Click "Enable" to enable the plugin.

#### Use
Challenge a user to a game by clicking on the user's name and selecting "Challenge User to Chess". The challenge will create a new private channel and both users will be invited. The user to play first will be decided at random. Clicking on the "Open Game" link in any of the posts generated by the plugin will bring up the game board. Actions that change the game state will generate a new post in the channel, and the new game state will be embedded in that post. The game board will always display the game state (including history) based on the most recent plugin-generated post in the channel.


Uses [cm-chessboard](https://github.com/shaack/cm-chessboard) and [chess.js](https://github.com/jhlywa/chess.js).
