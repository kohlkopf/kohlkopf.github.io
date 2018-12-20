---
layout: post 
title: Web development in RStudio
---

# RStudio and Jekyll

RStudio is feature-packed. The Viewer Pane will be the focus of the post today. Not only can you display plots and preview your rendered markdown documents, you can also serve locally hosted content! Some have used this to view shiny apps. Here we'll build our site locally and check it out in the viewer pane. Paired with github.io free hosting and support for Jekyll sites, you can update your site in almost real time from RStudio.

---

RStudio is great for web development for a few reasons:

### It has a console

You can use version control and run Jekyll from within you RStudio IDE.

### It has a viewer

View your locally served website as soon as you hit save.

### It has a fully featured editor

RStudio is built for coding. It has syntax highlighting and useful development shortcuts.

---

# 1. Jekyll serve

![terminal](/img/2018-12-20-jekyll_dev/terminal.png)

Assuming you already have Ruby installed and a Jekyll site running, kick up an RStudio session. Shift the focus to **Terminal** with the shortcut ⌥⇧ T or just click on it.  CStill in the terminal,  change to your project directory and run:

```{bash}
$ jekyll serve
```

You should see something like:

```{bash}
Configuration file: /Users/kohlkopf/Documents/kohlkopf.github.io/_config.yml
            Source: /Users/kohlkopf/Documents/kohlkopf.github.io
       Destination: /Users/kohlkopf/Documents/kohlkopf.github.io/_site
 Incremental build: disabled. Enable with --incremental
      Generating...
                    done in 1.26 seconds.
 Auto-regeneration: enabled for '/Users/kohlkopf/Documents/kohlkopf.github.io'
    Server address: http://127.0.0.1:4000
  Server running... press ctrl-c to stop.
```

The site is now being served at http://127.0.0.1:4000.

# 2. Viewer in RStudio

![console](/img/2018-12-20-jekyll_dev/console.png)

If you were following another Jekyll tutorial, you'd probably open up a web browser and navigated to http://127.0.0.1:4000 where you could see interact with your site. Instead of that, we'll ustilize the built in Viewer to interact with the site. Switch to the Console tab with the shortcut or just by clicking on it. Install the `devtools` R package:

```{r}
install.packages("devtools")
```

Then run `viewer()`, using the server address being used by Jekyll:

```{r}
viewer(url = "http://127.0.0.1:4000")
```

You should now see be able to interact with yoursite from within RStudio. Be sure to save your file, which Jekyll will then use to generate the upadate site. The Viewer pane will not automatically refresh, you'll need to navigate around to force reload.

![window](/img/2018-12-20-jekyll_dev/window.png)

