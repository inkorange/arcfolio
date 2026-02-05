# Portfolio Visualization Web App

## Basic Experience Goals

The application will be a journey through my professional and artistic career that showcases the different education, companies I worked for, personal projects, in a linear, time-based visualization. 

I want to show a collection of imagery, along with annotations that explain the item in more detail if interacted with, and broken out into sections -- defined  I will have labels that describe the sections of my career, IE: Education, Job 1, Job 2, Personal projects, all lined up in chronological order to be navigated through.

## Data Structure

The data will be driven by a locsl JSON file that will define the sections, descritpions, locations to the images, just text call-outs, background images to use, dates. An initial example file:

```JSON
{
    "sections": [
        {
            "title": "Syracuse University",
            "category": "Education",
            "logo": "/public/syracuselogo.jpg",
            "backgroundColor": "#23232", // css color varable
            "description": "Studied computer graphics with a focus on graphics programming. Traditionally trained artist with a flavor for special effects and procedural graphics programming.",
            "startDate": "2001-05-01", // May 1, 2001
            "backgroundImage-1": "/public/background1.jpg",
            "backgroundImage-2": "/public/background2.jpg",
            "backgroundImage-3": "/public/background3.jpg",
            "projects": [
                {
                    "title": "Artwork 1",
                    "description": "explanation of the item",
                    "url": null, // not required but would be a url address to a site
                    "date": "2001-05-02",
                    "media": "/public/artwork1.jpg",
                    "type": "image" // image | video
                },
                {
                    "title": "Class Project",
                    "description": "explanation of the item",
                    "url": null, // not required but would be a url address to a site
                    "date": "2001-05-03",
                    "media": "/public/artwork2.jpg",
                    "type": "image" // image | video
                }
            ]
        }
    ]
}
```
## UI Elements

The layouts would be a side scroller that will automatically scroll to the right slowly -- roughly 10% of the screen every second (configurable), as we visualize walking through my career history. So it would start at the first date in the collection of sections, and end at the last section.

The site will take up the entire screen, 100vh.

In theory, the entire page can be 20000px or more width, but we are slowly scrolling it to the left to visualize time as it passes.

Each section will have it's own designated area that contains all the projects, they will all be side by side in the horizontally laid out UI.

There should be an intro card that acts like a separator between sections that lists out in much large font, and with the supplied loogo and description. This will be on the front layer of the sliding animation (see the Parallax section). the card will use the backgroundColor designated as the background -- assuming it will be a dark color as the text will be white across the site. The first backgroundImage-1 will be used as a ghosted image in this intro card.

The projects will be cards that show the image or video with the title and date underneath it. See the UI Interactions section on what happens when a user interacts these cards.

The project cards should not overlap, but it would flow better if they were a little randomized vertically, but never go off the top or bottom of the screen, leave about 64px safe area on the top, we might add another visualization element there.

### Parallax 

The JSON object supplies up to 3 background images. These are going to be used to visualize the parallax effect of the side sliders.

The first background image will be used on the intro card section as described above.
The second will be assumed it is a long landscape image and will be situated in a layer behind the main section with the intro card, and project cards, and the size will be the height of the viewport. it will scroll slower than the top layer.

If a third background image is supplied, backgroundImage-3, it will be situated behind the backgroundImage-2, and scroll slightly slower than the level 2 image to give a even better parallax effect.

Uase the intro card as a separator between the different parralax section, since each section will have it's own parralax background images, and they are isolated to each section, and should never bleed over to other sections.

If the background image is not long enough, it should repeat horizontally.

## UI Interactions

The entire screen will slowly scroll to the left automatically, ~ 10% of the screen width per second.

When the user hovers over one of the project cards, it will wait 500ms, and if the mouse remains on the card, it will slow the scrolling effect (with transition) down to 0, and a details card will slide out from behind the hovered image with the description and url information on it.

Also when the iser hovers over the project image/card, it should zoom in slightly, and have a blurring or darkening effect behind it so it will now be the primary focus.

As the user blurs the image/video or description card for 500ms, it slides away, anmd we resume scrolling to the screen to the left again.

Everthing needs to be animated, transitins in and out.

## Technology Considerations

Since we are dealing with a lot of content on the page, and using parallax effects, this could have potential janky performance effects. Be sure to utilize pre-loading, and 3d css transitions leveraging hardware acceleration.

if we can make the parallax effect solely in CSS, that would be ideal, but if there are more performant packages out there, we can leverage that.

