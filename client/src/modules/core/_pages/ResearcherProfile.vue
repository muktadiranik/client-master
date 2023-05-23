<template>
  <main class="c-site-main">
    <!-- START SECTION: SECURITY RESEARCHER PROFILE -->
    <section class="section section-padding section--security-researcher-profile">
      <div class="l-wrap">
        <div class="flex-row">
          <div class="flex-col flex-col--md-8">
            <section class="SR-profile u-box-shadow">
              <div class="main">
                <div class="content">
                  <div class="picture">
                    <img src="images/arne_swinnen.jpg" alt="Security Researcher Profile Picture" />
                  </div>
                  <div class="summary">
                    <h3>Arne Swinnen <small>(arneswinnen)</small></h3>
                    <ul>
                      <li class="location">From Belgium</li>
                      <li class="member-since">Member since October, 2017</li>
                      <li>
                        <strong>Background Checked:</strong>
                        <span>Yes</span>
                      </li>
                      <li>
                        <strong>Identity Verified:</strong>
                        <span>Yes</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <!-- /.flex-col flex-col--md-8 -->
          <div class="flex-col flex-col--md-4">
            <section class="SR-stats box-shadow main">
              <div class="content">
                <ul>
                  <li><span>Community Rank:</span><span>1</span></li>
                  <li><span>Programs:</span><span>27</span></li>
                  <li><span>Companies:</span><span>12</span></li>
                </ul>
                <ul>
                  <li><span>Vulnerabilities:</span><span>64</span></li>
                  <li><span>Accuracy:</span><span>100%</span></li>
                </ul>
                <ul class="SR-social-profiles">
                  <li>
                    <a href="http://twitter.com/username"><i class="fa fa-twitter"></i></a>
                  </li>
                  <li>
                    <a href="http://facebook.com/username"><i class="fa fa-facebook-f"></i></a>
                  </li>
                </ul>
              </div>
            </section>
          </div>
          <!-- /.flex-col flex-col--md-4 -->
        </div>
        <!-- /.flex-row -->
        <div class="flex-row">
          <div class="flex-col">
            <section class="SR-hall-of-fame u-box-shadow">
              <div class="header">
                <h3 class="text-center">Hall Of Fame</h3>
              </div>
              <div class="main">
                <ul>
                  <li><img src="images/hall-of-fame-logos/80x80.png" alt="" /></li>
                  <li><img src="images/hall-of-fame-logos/80x80.png" alt="" /></li>
                  <li><img src="images/hall-of-fame-logos/80x80.png" alt="" /></li>
                  <li><img src="images/hall-of-fame-logos/80x80.png" alt="" /></li>
                  <li><img src="images/hall-of-fame-logos/80x80.png" alt="" /></li>
                  <li><img src="images/hall-of-fame-logos/80x80.png" alt="" /></li>
                  <li><img src="images/hall-of-fame-logos/80x80.png" alt="" /></li>
                  <li><img src="images/hall-of-fame-logos/80x80.png" alt="" /></li>
                  <li><img src="images/hall-of-fame-logos/80x80.png" alt="" /></li>
                  <li><img src="images/hall-of-fame-logos/80x80.png" alt="" /></li>
                  <li><img src="images/hall-of-fame-logos/80x80.png" alt="" /></li>
                </ul>
              </div>
            </section>
          </div>
          <!-- /.flex-col -->
        </div>
        <!-- /.flex-row -->
        <div class="flex-row">
          <div class="flex-col">
            <section class="SR-vulnerabilites box-shadow text-center">
              <div class="header">
                <h3>Reported Vulnerabilites</h3>
              </div>
              <div class="main">
                <p>View trends in the volume of submissions reported.</p>
                <div class="chart-container">
                  <canvas id="chart"></canvas>
                </div>
              </div>
            </section>
          </div>
          <!-- /.flex-col -->
        </div>
        <!-- /.flex-row -->
      </div>
    </section>
    <!-- END SECTION: SECURITY RESEARCHER PROFILE -->
  </main>
</template>
