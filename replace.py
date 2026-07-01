import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

services = [
    ('svc_youtube.png', 'YouTube Video Editing', 'fab fa-youtube', ''),
    ('svc_shorts.png', 'Shorts & Reels Editing', 'fas fa-mobile-alt', ' shorts-icon'),
    ('svc_tiktok.png', 'TikTok Editing', 'fab fa-tiktok', ' tiktok-icon'),
    ('svc_ads.png', 'Social Media Ads', 'fas fa-ad', ' ads-icon'),
    ('svc_motion.png', 'Motion Graphics', 'fas fa-magic', ' motion-icon'),
    ('svc_color.png', 'Color Grading', 'fas fa-palette', ' color-icon'),
    ('svc_audio.png', 'Audio Enhancement', 'fas fa-headphones', ' audio-icon'),
    ('svc_thumb.png', 'Thumbnail Design', 'fas fa-image', ' thumb-icon')
]

for img, title, icon, extra_class in services:
    old_icon = f'<div class="service-icon-wrap">\n          <div class="service-icon{extra_class}"><i class="{icon}"></i></div>\n          <div class="service-icon-glow"></div>\n        </div>\n        <h3>'
    new_html = f'<div class="service-img-wrap">\n          <img src="{img}" alt="{title}" class="service-img">\n        </div>\n        <div class="service-content">\n          <h3>'
    html = html.replace(old_icon, new_html)

# Now we need to close the .service-content div for each card.
# A card ends with:
#         </div>
#       </div>
# We want to change it to:
#         </div>
#         </div>
#       </div>
# But ONLY for service cards. Let's use regex to find service cards.
def replacer(match):
    content = match.group(0)
    if '<div class="service-content">' in content:
        # replace the last "      </div>" with "      </div>\n      </div>"
        return content[:-6] + "  </div>\n      </div>"
    return content

# The structure of a card is <div class="service-card ...> ... </div>
# We can just split by '<div class="service-card' and process each.
parts = html.split('<div class="service-card')
for i in range(1, len(parts)):
    # find the end of the card which is a line with just "      </div>"
    # Actually simpler: just find '        </div>\n      </div>' and replace with '        </div>\n        </div>\n      </div>'
    # Wait, the end of the features is:
    #           <span>...</span>
    #         </div>
    #       </div>
    # Let's replace:
    # "        </div>\n      </div>"
    # with
    # "        </div>\n        </div>\n      </div>"
    # ONLY if it's inside a part that has '<div class="service-content">'
    if '<div class="service-content">' in parts[i]:
        parts[i] = parts[i].replace('        </div>\n      </div>', '        </div>\n        </div>\n      </div>', 1)

html = '<div class="service-card'.join(parts)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Done")
