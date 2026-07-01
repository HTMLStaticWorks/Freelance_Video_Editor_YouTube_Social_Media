with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

reps = {
    '<a href="#contact" class="btn-primary nav-cta" id="nav-cta">Get Free Quote</a>': '<a href="#contact" class="btn-primary nav-cta" id="nav-cta\"><span>Get Free Quote</span></a>',
    '<a href="#contact" class="btn-primary" id="hero-cta-quote">\n        <i class="fas fa-comment-dots"></i> Get Free Quote\n      </a>': '<a href="#contact" class="btn-primary" id="hero-cta-quote">\n        <i class="fas fa-comment-dots"></i> <span>Get Free Quote</span>\n      </a>',
    '<a href="#portfolio" class="btn-outline" id="hero-cta-portfolio">\n        <i class="fas fa-play-circle"></i> View Portfolio\n      </a>': '<a href="#portfolio" class="btn-outline" id="hero-cta-portfolio">\n        <i class="fas fa-play-circle"></i> <span>View Portfolio</span>\n      </a>',
    '<a href="#contact" class="btn-outline pricing-btn" id="pricing-starter-btn">Get Started</a>': '<a href="#contact" class="btn-outline pricing-btn" id="pricing-starter-btn"><span>Get Started</span></a>',
    '<a href="#contact" class="btn-primary pricing-btn" id="pricing-creator-btn">Start Creating</a>': '<a href="#contact" class="btn-primary pricing-btn" id="pricing-creator-btn"><span>Start Creating</span></a>',
    '<a href="#contact" class="btn-outline pricing-btn" id="pricing-business-btn">Go Business</a>': '<a href="#contact" class="btn-outline pricing-btn" id="pricing-business-btn"><span>Go Business</span></a>',
    '<a href="#contact" class="btn-primary footer-cta">Get Free Quote</a>': '<a href="#contact" class="btn-primary footer-cta"><span>Get Free Quote</span></a>'
}

for k, v in reps.items():
    html = html.replace(k, v)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Replaced')
