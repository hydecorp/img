# hy-img

~~**hy-img** is a image tag drop-in replacement that lazy-loads TODO~~

## Deprecation
Replacing `img` tags with arbitrary web components --- even with a `noscript` fallback --- had negative side effects, such as images not showing in reader views, etc.

This component is now deprecated in favor of a standards-based approach using `loading="lazy"` and setting `width` and `height` on `img` tags in conjunction with setting the CSS property `aspect-ratio: attr(width) / attr(height)`.

For more see below:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Native &lt;img&gt; lazy-loading is coming to the web! <a href="https://t.co/LgF7F1iMgR">https://t.co/LgF7F1iMgR</a> &lt;img loading=lazy&gt; defers offscreen images until the user scrolls near them. Shipping in Chrome ~75 <a href="https://t.co/4gR7lvx4zx">https://t.co/4gR7lvx4zx</a> <a href="https://t.co/luCHEfLkKD">pic.twitter.com/luCHEfLkKD</a></p>&mdash; Addy Osmani (@addyosmani) <a href="https://twitter.com/addyosmani/status/1114777583302799360?ref_src=twsrc%5Etfw">April 7, 2019</a></blockquote> 

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Chrome is implementing a change to avoid layout jank during image loading 🖼💨<br><br>This calculates aspect ratio using width/height attributes <br>(to size images using/CSS) before they have fully loaded. Already in Firefox 🦊<a href="https://t.co/6GpCeyGPm9">https://t.co/6GpCeyGPm9</a> ty <a href="https://twitter.com/jensimmons?ref_src=twsrc%5Etfw">@jensimmons</a> &amp; CSSWG! <a href="https://t.co/I1fhWv0Jqy">pic.twitter.com/I1fhWv0Jqy</a></p>&mdash; Addy Osmani (@addyosmani) <a href="https://twitter.com/addyosmani/status/1169813271009886208?ref_src=twsrc%5Etfw">September 6, 2019</a></blockquote> 

## Post-mortem
`hy-img` was born out of dissatisfaction with existing lazy loading techniques, specifically the lack of cancellation of requests for images that went out of view again.
This was especially useful for users on ultra-slow connections.
Whether this is supported in the future is up to browser implementations of `loading="lazy"`.
The techniques used in the component had many downsides too,required an additional server-side step, and most notably broke images in Safari and Firefox reader views and likely other user agents too.