# Mixcloud plugin for Volumio

Volumio plugin for playing Mixcloud shows.

*This plugin is not affiliated with Mixcloud whatsoever.*

This repository has two branches:

1. The `master` branch is targeted towards Volumio 3.
2. The `volumio-2.x` branch is targeted towards Volumio 2.x.

The focus is on the `master` branch. The `volumio-2.x` branch will only be maintained if it is practically feasible and still worthwhile to do so.

## Limitations

- Mixcloud login is not supported. This means you will not be able to access exclusive content or account-specific features.
- This plugin does **not** fetch data through an official API. Any changes on Mixcloud's end has the potential to break the plugin.

## Support Mixcloud and Content Creators

The purpose of this plugin is to allow you to discover shows and content creators on Mixcloud through Volumio. If you come across something that you like, consider taking out a [Select subscription](https://www.mixcloud.com/select/) on Mixcloud. For convenience sake, the plugin displays links for viewing shows and users on the Mixcloud website. You can also access the creator of a currently playing show through the menu in Volumio's player view / trackbar (click the ellipsis icon to bring up the menu).

## Changelog

0.1.0a-20210310
- Avoid cut-offs at ~10 minutes into playback due to buggy MPD in Volumio

0.1.0a
- Initial release
