with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()
html = html.replace('        <div class="step-connector"></div>\n', '')
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Removed step-connectors')
