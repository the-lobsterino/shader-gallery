// As this was my first occasion to examine the shader code on this site,
// the value range of the input uniforms were not clear. So I rewrote the
// "parent" code to make this obvious.  (LittleBrainz)


precision mediump float;


uniform float time;      // increasing at a rate of 1.0 per second
uniform vec2 mouse;      // bottom left: (0.0, 0.0), top right: (1.0, 1.0)
uniform vec2 resolution; // bottom left: (0.0, 0.0), top right: window pixel size


void main()
{
	float x =  0.0 + 1.0 * gl_FragCoord.x / resolution.x; // x is  0.0 to 1.0
	float y = -1.0 + 2.0 * gl_FragCoord.y / resolution.y; // y is -1.0 to 1.0

	float s = cos(x * 6.283 + time); // moving sine wave
	
	float r = abs(y - s) < 0.005 ? 1.0 : 0.0; // paint line thickness
	
	float g = (mouse.x < 0.1 || 0.9 < mouse.x) ? 0.2 : 0.0; // check mouse range
	float b = (mouse.y < 0.1 || 0.9 < mouse.y) ? 0.2 : 0.0;
	
	gl_FragColor = vec4(r, g, b, 1.0);
}