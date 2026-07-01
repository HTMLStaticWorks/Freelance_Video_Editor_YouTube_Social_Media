with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

reps = {
    '<a href="#contact" class="btn-primary nav-cta" id="nav-cta"><span>Get Free Quote</span></a>': '<a href="#pricing" class="btn-primary nav-cta" id="nav-cta"><span>Get Free Quote</span></a>',
    '<a href="#contact" class="btn-primary mobile-cta">Get Free Quote</a>': '<a href="#pricing" class="btn-primary mobile-cta">Get Free Quote</a>',
    '<a href="#contact" class="btn-primary" id="hero-cta-quote">': '<a href="#pricing" class="btn-primary" id="hero-cta-quote">',
    '<a href="#contact" class="btn-primary footer-cta"><span>Get Free Quote</span></a>': '<a href="#pricing" class="btn-primary footer-cta"><span>Get Free Quote</span></a>',
    '<a href="#contact" class="float-cta" id="float-cta" aria-label="Get a free quote">': '<a href="#pricing" class="float-cta" id="float-cta" aria-label="Get a free quote">'
}

for k, v in reps.items():
    html = html.replace(k, v)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated!")
