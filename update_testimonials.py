#!/usr/bin/env python3
import re

# Read the file
with open('/Users/mac/Documents/zyDual/zyDual.in/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Old testimonials section
old_testimonials = '''        <h2 class="section-title">Testimonials</h2>
        <div class="testimonials-wrapper">
          <article class="testimonial-card glass-card active">
            <div class="testimonial-stars">★★★★★</div>
            <p>"zyDual transformed our online presence and drove 3x revenue in six months. Their team is strategic, reliable, and creative."</p>
            <h4>— Mahidar, CEO</h4>
          </article>
          <article class="testimonial-card glass-card">
            <div class="testimonial-stars">★★★★★</div>
            <p>"The web experience they built reflects the premium quality of our brand. The process was smooth, and results were immediate."</p>
            <h4>— Joseph.</h4>
          </article>
          <article class="testimonial-card glass-card">
            <div class="testimonial-stars">★★★★★</div>
            <p>"A passionate agency that delivers measurable ROI. From design to execution, they were outstanding."</p>
            <h4>— Mudasira., Founder(saida)</h4>
          </article>
        </div>
        <div class="testimonial-nav">
          <button class="testimonial-btn" data-index="0" aria-label="Testimonial 1"></button>
          <button class="testimonial-btn" data-index="1" aria-label="Testimonial 2"></button>
          <button class="testimonial-btn" data-index="2" aria-label="Testimonial 3"></button>
        </div>'''

# New modern testimonials section
new_testimonials = '''        <h2 class="section-title">Testimonials</h2>
        <p class="section-subtitle">What our clients say about working with us.</p>

        <div class="testimonials-carousel">
          <button class="carousel-arrow prev" aria-label="Previous testimonial">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          
          <div class="testimonials-track">
            <article class="testimonial-slide active">
              <div class="testimonial-avatar">
                <img src="https://ui-avatars.com/api/?name=Mahidar&background=7c3aed&color=fff&size=80" alt="Mahidar" />
              </div>
              <div class="testimonial-stars">★★★★★</div>
              <p class="testimonial-quote">"zyDual transformed our online presence and drove 3x revenue in six months. Their team is strategic, reliable, and creative."</p>
              <div class="testimonial-author">
                <h4>Mahidar</h4>
                <span>CEO</span>
              </div>
              <div class="testimonial-company">RealTech IT Academy</div>
            </article>
            
            <article class="testimonial-slide">
              <div class="testimonial-avatar">
                <img src="https://ui-avatars.com/api/?name=Joseph&background=2dd4bf&color=fff&size=80" alt="Joseph" />
              </div>
              <div class="testimonial-stars">★★★★★</div>
              <p class="testimonial-quote">"The web experience they built reflects the premium quality of our brand. The process was smooth, and results were immediate."</p>
              <div class="testimonial-author">
                <h4>Joseph</h4>
                <span>Director</span>
              </div>
              <div class="testimonial-company">Vetriarasi</div>
            </article>
            
            <article class="testimonial-slide">
              <div class="testimonial-avatar">
                <img src="https://ui-avatars.com/api/?name=Mudasira&background=f59e0b&color=fff&size=80" alt="Mudasira" />
              </div>
              <div class="testimonial-stars">★★★★★</div>
              <p class="testimonial-quote">"A passionate agency that delivers measurable ROI. From design to execution, they were outstanding."</p>
              <div class="testimonial-author">
                <h4>Mudasira</h4>
                <span>Founder</span>
              </div>
              <div class="testimonial-company">Saidah Collections</div>
            </article>
          </div>
          
          <button class="carousel-arrow next" aria-label="Next testimonial">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
        
        <div class="testimonial-dots">
          <button class="dot active" data-index="0" aria-label="Testimonial 1"></button>
          <button class="dot" data-index="1" aria-label="Testimonial 2"></button>
          <button class="dot" data-index="2" aria-label="Testimonial 3"></button>
        </div>'''

# Replace
new_content = content.replace(old_testimonials, new_testimonials)

# Write back
with open('/Users/mac/Documents/zyDual/zyDual.in/index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Testimonials section updated successfully!")