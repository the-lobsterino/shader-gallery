#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

float phase_sine = fract(time);
float amp_sine = 1.0;
float x_freq = 128.0;
uniform vec2 resolution;
float y_freq = 4.0;
float expo = 16.0;
float phase_mod = 0.5;
float flip = 1.0;

void main(){
	
  float x_phasor = gl_FragCoord.x/resolution.x;
  float x_step = floor(x_phasor*x_freq)/x_freq;
  float cos_sig = cos(radians(x_step*360.0));
  float cos_flip = flip == 0.0? cos_sig:((abs(((cos_sig*0.5)+0.5)-1.0))*2.0)-1.0;
  float wave = gl_FragCoord.y < (resolution.y/2.0) ? cos_flip: cos_sig;
  float x_step_mod = (wave*0.5)*phase_mod;
  float y_phasor = fract(fract((gl_FragCoord.y/resolution.y)+x_step_mod)*y_freq);

  float x_tri = abs((abs(x_phasor-0.5)*2.0)-1.0);
  float y_tri = abs((abs(y_phasor-0.5)*2.0)-1.0)*0.5;

  float width = 2.0;

  float x_sine_sig = fract(x_step+phase_sine);
  float x_sine_flip = gl_FragCoord.y < (resolution.y/2.0) ? abs(x_sine_sig-flip): x_sine_sig;
  float x_sine = sin(radians(x_sine_flip*360.0))*amp_sine;
  float break_pt = fract((x_sine*0.4)+0.5); 
  float y_env = y_phasor<break_pt ? y_phasor/break_pt:abs(((y_phasor-break_pt)/(1.0-break_pt))-1.0);

  float d4 = abs((abs(fract(fract(x_phasor*x_freq)-y_env))*2.0)-1.0);

  gl_FragColor=vec4(pow(d4,expo), 0, 0, 0.5);


}
