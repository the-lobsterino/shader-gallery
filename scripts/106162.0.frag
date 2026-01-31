/* lame-ass tunnel by🎇 kusma */

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;




float rand (float x) {
	return fract(sin(x * 246214.63) * 736817.342);	
}

void main( void ) {
	vec2 position = (gl_FragCoord.xy - resolution * 0.5) / resolution.yy;
	float th = atan(position.y, position.x) / (2.0 * 3.1415926) + 122.0;
	float dd = length(position);
	float d = 8.85 / dd + time;

	vec3 uv = vec3(th + d, th - d, th + sin(d));
	float a = 0.5 + cos(uv.x * 3.1415926 * 2.0) * 0.3;
	float b = 0.5 + cos(uv.y * 3.1415926 * 8.0) * 0.3;
	float c = 0.5 + cos(uv.z * 3.1415926 * 6.0) * 0.5;
	float f = abs(sin(time*2.0));
	vec3 color = mix(vec3(2.8, 0.2, 1.0-f), vec3(0.5*f, 0, 0), pow(a, 0.2)) * 2.;
	color += mix(vec3(0.8, 2.9, 1.0), vec3(0.31, 0.1, 2.2),  pow(b, 0.1)) * 0.05;
	color += mix(vec3(0.0, 3.8, 1.0), vec3(0.1, 0.4, 4.2),  pow(c, 0.1)) * 0.75;
	
	float scale = sin(0.1 * time) * 0.5 + 5.0;
	float distortion = resolution.y / resolution.x;

	vec2 position2 = (((gl_FragCoord.xy * 0.8 / resolution) ) * scale);
	position2.y *= distortion;

	float gradient = 0.0;
	vec3 color2 = vec3(0.0);
 
	float fade = 0.5;
	float z;
 
	vec2 centered_coord = position2 - vec2(2.0,2.0);

	for (float i=1.0; i<=2.0; i++)
	{
		vec2 star_pos = vec2(sin(i) * 20.0, sin(i*i*i) * 300.0);
		float z = mod(i*i - 10.0*time, 2.0);
		float fade = (46.0 - z) /30.0;
		vec2 blob_coord = star_pos / z;
		gradient += ((fade / 150.0) / pow(length(centered_coord - blob_coord ), 4.8)) * ( fade);
	}

	color2 = color * gradient;
	
	gl_FragColor = vec4( max( color * clamp(dd, 0.0, 0.6) , color2 ) , 1.0);
}