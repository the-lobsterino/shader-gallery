//https://stackoverflow.com/a/24792822

precision mediump float;

uniform vec2 offset; // e.g. [-0.023500000000000434 0.9794000000000017], currently the same as the x/y offset in the mvMatrix

void main() {
  float pitchx = 50.0;
  float pitchy = 50.0;
  float offsetx = 71.0;
  float offsety = 0.0;
	
  float lX = gl_FragCoord.x / 1200.0;
  float lY = gl_FragCoord.y / 900.0;

  float scaleFactor = 10000.0;

  float offX = (scaleFactor * offsetx) + gl_FragCoord.x;
  float offY = (scaleFactor * offsety) + (1.0 - gl_FragCoord.y);

  if (int(mod(offX, pitchx)) == 0 || int(mod(offY, pitchy)) == 0) {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  } else {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 112.0);
  }
}