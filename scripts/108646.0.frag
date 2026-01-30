

#ifdef GL_ES
precision mediump float;
#endif
 
#extension GL_OES_standard_derivatives : enable
 
// DOF Snowfield!
// Mouse X controls focal depth
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
 
vec3 snowflake(vec3 coords, vec2 pxPos) {
	float focalPlane = 0.1 + 2.5 * mouse.x;
	float iris = 0.01;
	
	float pxDiam = abs(coords.z - focalPlane) * iris;
	vec2 flakePos = vec2(coords.xy) / coords.z;
	float flakeDiam = 0.005 / coords.z;
	
	float dist = length(pxPos - flakePos);
	float bri = (pxDiam + flakeDiam - dist) / (pxDiam * 2.0);
	if (pxDiam > flakeDiam) {
		bri /= (pxDiam / flakeDiam);
	}
 
	return vec3(0.6, 0.4, 0.4) * min(1.5, max(0.0, bri));
}
 
void main( void ) {
	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) - 1.0;
	pos.y *= resolution.y / resolution.x;
 
	gl_FragColor.rgb = vec3(0.0, 0.03, 0.09);
	for (int i=0; i<111; i++) {
		vec3 c = vec3(1);
		c.z = fract(sin(float(i) * 25.643) * 722.5373);
		c.z *= 0.2 + fract(sin(float(i) * 14.753) * 52.5463);
		c.z = 0.5 + (1.0 - c.z) * 2.4;
		float gSize = 0.6 / c.z;
		vec2 drift = vec2(0.5);
		drift.x = fract(sin(float(i) * 548.3464) * 133.43354) * 4.0;
		drift.x = drift.x + time * 0.06 + 4.0 * sin(time * 0.03 + c.z * 5.0);
		drift.y = fract(sin(float(i) *83.2356) * 2.53463) * 4.0;
		drift.y = drift.y + time * -0.1;
		drift /= c.z;
 
		vec2 grid = vec2(mod((pos.x+drift.x)/c.z, gSize), mod((pos.y-drift.y)/c.z, gSize));
		c.x = gSize*1.5;
		c.y = gSize*1.5;
		gl_FragColor.rgb += snowflake(c, grid);
	}
	gl_FragColor.a = 1.0;
}