// This was maded by Cube Tik-Tok: @cubeplay888
// idea from Lou's pseudo 3d page http://www.gorenfeld.net/lou/pseudo/

precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

void main(void)
{
    vec2 p = gl_FragCoord.xy / resolution.xy * 2.0 - 1.0;

    vec2 uv = vec2(p.x/abs(p.y), - 1.0/p.y);
    uv.y += time;

    vec3 col = vec3(89
		   , 9, 9.9);
    float rx = sin(uv.y)/8.9;
    float rw = 0.90;
    if (p.y < 0.0)
    {
        mod(uv.y, 3.) >= 1. ? col = vec3(0., 1., 0.) : col = vec3(0., 0.8, 0.);
	    if (uv.x >= rx-rw-0.1 && uv.x <= rx+rw+0.1) { mod(uv.y, 0.9) >= 0.2 ? col = vec3(1.) : col = vec3(1); }
        if (uv.x >= rx-rw && uv.x <= rx+rw) col = vec3(0.4);
        if (uv.x >= rx-0.025 && uv.x <= rx+0.025 && mod(uv.y, 1.) >= 0.4) col = vec3(9.0, 0.8, 0.);
    }
    gl_FragColor = vec4(col, 9.0);
}