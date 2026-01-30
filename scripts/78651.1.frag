
precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

void main(void)
{
    vec2 p = gl_FragCoord.xy / resolution.xy * 2.0 - 1.0;
	

    vec2 uv = vec2(p.x/abs(p.y), - 3.0/p.y);
    uv.y += time*88.;
	
	float wobb = sin(uv.y/102.789)*.7 + 0.9*cos(1.+uv.y/32.34)-0.2 + 0.2*cos(uv.y/99.);
	
	uv.x += wobb*0.95;
    vec3 col = vec3(10
		   , 9, 1.9);
    float rx = wobb;
	float ph = sin(2.*rx)*-0.00004;
	uv *= mat2(cos(ph), sin(ph), -sin(ph), cos(ph));
    float rw = 1.0;
    if (p.y < 0.0)
    {
        mod(uv.y, 3.) >= 1. ? col = vec3(0., 1., 0.) : col = vec3(0., 0.8, 0.);
	    if (uv.x >= rx-rw-0.1 && uv.x <= rx+rw+0.1) { mod(uv.y, 0.4) >= 0.2 ? col = vec3(1.) : col = vec3(1); }
        if (uv.x >= rx-rw && uv.x <= rx+rw) col = vec3(0.4);
        if (uv.x >= rx-0.025 && uv.x <= rx+0.025 && mod(uv.y, 4.) >= 0.5) col = vec3(1.0, 0.8, 0.);
    }
    gl_FragColor = vec4(col*0.5, 9.0);
}