---
layout: post 
title: Wholebrain vignette
---

# Daniel Fürth's Wholebrain

The purpose of WholeBrain is to provide a user-friendly and efficient way for scientist with minimal knowledge of computers to create anatomical maps and integrate this information with behavioral and physiological data for sharing on the web. Software website [here](http://www.wholebrainsoftware.org/).

WholeBrain was conceived and created by Daniel Fürth, during his PhD in Konstantinos Meletis lab, at Department of Neuroscience, Karolinska Institutet.

Daniel is now a postdoctoral researcher in Jay Lee's lab at Cold Spring Harbor Laboratory working on next-generation of in situ sequencing methods.

I've written up a tutorial for processing a single section (guided by Daniel's video) for use by members of my lab and others who may find it useful. Find the accompanying script in my [github repo](https://github.com/kohlkopf/wholebrain_scripts/blob/master/single_image_script.R).

---

# *Load wholebrain*


You've gotten `wholebrain` installed! Load it

```{r}
library(wholebrain)
```

---

# *Load the image*

The images that pass through the imaging center that I've dealt with have been z-projected (average intensity) multi-channel TIFFs. Hopefully yours are the same. It really helps to have the DAPI and the signal on separate channels (I'll assume this is the case for this vignette) but it is possible call neurons and call the brain outline with only one channel. `get.images()` requires a folder, but you can also manually assign the path to the image instead of using `get.images()`.

```{r}
#get.images()takes a folder as input
image <- get.images(x='~/Images/', type="tif")
#image <- "/Users/kk2252/Images/MTP-Cre-H129dTT-120hrs_37_Image.vsi.Collection_X-82.64_mmY-62.86_mm_Layer5.tif"
```

---

# *Segment*


# Neurons
This step will set up the filter for calling neurons. Don't worry about detection of the brain outline, we'll set that filter next. In the image I was using channel two had the signal, your mileage may vary. I find it helpful to bring the upper threshold of the 8-bit render down low enough to be able to see the signal. Then I bring the lower threshold of intensity up to start excluding false signal. Use the H key to toggle the highlighted neurons. Then fine tuning of soma area and eccentricity follow.

+ 8-bit render: visual contrast
+ eccentricity: (elongation) of contours sets how round you want cell bodies to be; default is 1000 and smaller values equal to more round
+ soma area: area limits for what to consider as cell bodies
+ intensity: threshold range in the minimum and maximum in fluorescent intensity where the algorithm should search for neurons

```{r}
neuron_seg <- segment(input=image, channel=2)
```

![](/img/2019-1-4-wholebrain_single/neuron_seg_alt.png)

When you are done, hit the Esc or Q key to exit and save these parameters to the `neuron_seg` object. You'll see some output like the following in the console:

```
OUTPUT SEGMENTED CELLS: 5700
```

# Brain outline

Now we'll find the outline of the brain. This will be used when wholebrain attempts to automatically align the section to the atlas. In the image I was using channel 0 had the DAPI staining.

Don't touch the `resize` slider, we'll set it manually after closing the open image/sliders. Any attempt to adjust it results in setting that `brain_seg$filter$resize` being set to `0`. 

Relevant parameters

+ brain.outline: the exact value where you want to start segmenting the brain outline in auto-fluorescence
+ blur: parameter that sets the smoothness of the tissue outline, if jagged edges increase the threshold; using a value of 4 is usually recommended.
+ resize: parameter to match the atlas to your pixel resolution, should be between 0.03 and 0.2 for most applications; increasing the value decreases the relative size of the atlas

```{r}
brain_seg <- segment(input=image, channel=0)
#set resize manually
brain_seg$filter$resize <- 0.06
```

![](/img/2019-1-4-wholebrain_single/brain_seg_alt.png)

---

# *Registration*

Now we'll align the section to the atlas and count the neurons. You'll have to manually inspect the section and determine the corresponding bregma, specified in the `registration()` function call as the argument `coordinate`. You can use `imshow` to view the image.

```{r}
imshow(image)
```

![](/img/2019-1-4-wholebrain_single/imshow.png)

Now that you have your bregma, you're ready to register. I've added some interactivity to this. There will be an automatic registration process with numbered points. You'll see a message in the R console, `Input a vector of points to remove, enter if OK: `. 

![](/img/2019-1-4-wholebrain_single/reg_rem_pounts.png)

The first thing you'll is the software attempt at auto-registration. I find that most of the the outline if registered well but that the inner part need some help. 

![](/img/2019-1-4-wholebrain_single/auto_reg.png)

Here you can remove any erroneous automatically added registration points. You can then add your own registration points to the image. Add one on the right section image first, then add a corresponding point to the atlas schematic on the left. I find the algorithm find the outline pretty well but lining up the ventricles and other more central features requires manual work. It helps to add a few to the center line. Right click when you are done adding points.

If you get `Error in transformationgrid$mx[index] :` before getting to registration you'll have to change the `resize` parameter in the `brain_seg$filter`.

```{r}
quartz(width=15, height=10)
input.points=""
regi <- registration(image, filter = brain_seg$filter, coordinate=1.4, display=TRUE, channel=0)
input.points <- readline(prompt="Input a vector of points to remove, enter if OK: ")
input.points
if(!(input.points == "")){
    regi <- remove.corrpoints(regi, eval(parse(text=input.points)))}
regi <- add.corrpoints(regi)
#re-register with added/removed points and show
regi<-registration(image, coordinate=1.9, filter = brain_seg$filter, display=TRUE, channel=0, correspondance=regi)
dev.off()
```

---

# *Save the info*

First view the registration and called neurons. 

Assign the same function to a variable to save the output. Save the called neurons and their intensity, region, coordinates, etc. in to a dataframe called `dataset`.

```{r}
dataset<-inspect.registration(regi, neuron_seg, soma = TRUE, forward.warps = TRUE, batch.mode = TRUE)
dev.copy(pdf, paste0('~/Registrations/',tools::file_path_sans_ext(basename(image)), '.pdf'), width=18, height=8)
dev.off()
```

---

# *Visualize the data*

# Dotplot

Compare right and left hemisphere expression by region in a plot format.

```{r}
dot.plot(dataset)
```

![](/img/2019-1-4-wholebrain_single/dotplot.png)

# Schematic

Visualize called neurons overlain on the atlas.
```{r}
schematic.plot(dataset)
```

![](/img/2019-1-4-wholebrain_single/schematic_plot.png)

# Webmap

This is a really cool, interactive visualization of called neurons on top of you section. Be sure to enable the showing of the called neurons by clicking on the button in the bottom right corner.

```{r}
pixel.resolution<-1 #1 micron
#this will output in the script folder
makewebmap(img = image, filter = brain_seg$filter, registration = regi, dataset = dataset, scale = 0.64, fluorophore = "tdTomato")
```

![](/img/2019-1-4-wholebrain_single/webmap.png)

# Glassbrain

View called neurons in a 3D atlas, helpful for multiple sections.

```{r}
glassbrain(dataset, plane="sagittal", laterality=FALSE)
planes3d(0,0,1, col = 'lightblue', alpha = 0.9)
```

![](/img/2019-1-4-wholebrain_single/glassbrain.png)