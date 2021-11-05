# Mixcloud plugin for Volumio

Volumio plugin for playing Mixcloud shows.

*This plugin is not affiliated with Mixcloud whatsoever.*

This repository has two branches:

1. The `master` branch is targeted towards Volumio 3.
2. The `volumio-2.x` branch is targeted towards Volumio 2.x.

The focus is on the `master` branch. The `volumio-2.x` branch will only be maintained if it is practically feasible and still worthwhile to do so.

## Getting Started

To install the Mixcloud plugin, first make sure you have [enabled SSH access](https://volumio.github.io/docs/User_Manual/SSH.html) on your Volumio device. Then, in a terminal:

```
$ ssh volumio@<your_Volumio_address>

// You can copy and paste each line after the $ sign

volumio:~$ mkdir mixcloud-plugin
volumio:~$ cd mixcloud-plugin
volumio:~/mixcloud-plugin$ git clone https://github.com/patrickkfkan/volumio-mixcloud.git
volumio:~/mixcloud-plugin$ cd volumio-mixcloud
volumio:~/mixcloud-plugin$ git checkout volumio-2.x
volumio:~/mixcloud-plugin/volumio-mixcloud$ volumio plugin install

...
Progress: 100
Status :Mixcloud Successfully Installed, Do you want to enable the plugin now?
...

// If the process appears to hang at this point, just press Ctrl-C to return to the terminal.
```

Now access Volumio in a web browser. Go to ``Plugins -> Installed plugins`` and enable the Mixcloud plugin by activating the switch next to it.

### Updating

When a new version of the plugin becomes available, you can ssh into your Volumio device and update as follows (assuming you have not deleted the directory which you cloned from this repo):

```
// You can copy and paste each line after the $ sign

volumio:~$ cd ~/mixcloud-plugin/volumio-mixcloud/
volumio:~/mixcloud-plugin/volumio-mixcloud$ git pull
volumio:~/mixcloud-plugin/volumio-mixcloud$ git checkout volumio-2.x
volumio:~/mixcloud-plugin/volumio-mixcloud$ git pull
...
volumio:~/mixcloud-plugin/volumio-mixcloud$ volumio plugin update

This command will update the plugin on your device
...
Progress: 100
Status :Successfully updated plugin

// If the process appears to hang at this point, just press Ctrl-C to return to the terminal.

volumio:~/mixcloud-plugin/volumio-mixcloud$ sudo systemctl restart volumio
```

## Limitations

- Mixcloud login is not supported. This means you will not be able to access exclusive content or account-specific features.
- This plugin does **not** fetch data through an official API. Any changes on Mixcloud's end has the potential to break the plugin.

## Support Mixcloud and Content Creators

The purpose of this plugin is to allow you to discover shows and content creators on Mixcloud through Volumio. If you come across something that you like, consider taking out a [Select subscription](https://www.mixcloud.com/select/) on Mixcloud. For convenience sake, the plugin displays links for viewing shows and users on the Mixcloud website. You can also access the creator of a currently playing show through the menu in Volumio's player view / trackbar (click the ellipsis icon to bring up the menu).

## Changelog

0.1.0
- Minor change to loading of translations
- Update readme after branching from `master` for Volumio 2.x

0.1.0a-20210310
- Avoid cut-offs at ~10 minutes into playback due to buggy MPD in Volumio

0.1.0a
- Initial release
