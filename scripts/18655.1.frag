#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
float speed = 20.0;
vec2 kResolution = vec2(512.0, 256.0);
 
float GetScreenPixel(vec2 vScreenPixel)
{        
	
	float f = atan(vScreenPixel.x *0.0432 + sin(vScreenPixel.y * 0.0423)+ time * 3.0/ speed);
	f = f + cos(vScreenPixel.y * 0.0454513 + sin(vScreenPixel.x * 0.07213) + time * 5.0/speed);
	f = f + cos(vScreenPixel.x * 0.043353 + sin(vScreenPixel.y * 0.043413) + time * 8.0/speed);
	f = f + tan(vScreenPixel.y * 0.0443513 + sin(vScreenPixel.x * 0.036313) + time * 10.0/ speed);
	f = f * 0.125 + 0.7;
	
	vec2 vGridPos = mod(vScreenPixel, 5.0);
	float fThreshold = fract(vGridPos.x * 0.25 + vGridPos.y * 0.5) * 0.75 + fract(vGridPos.y * 0.25 + vGridPos.x * 0.5) * sin(time) * 0.55;
	
	return step(f, fThreshold);
}

void main( void )
{
	vec2 vUV = ( gl_FragCoord.xy / resolution.xy );
	vec2 vScreenUV = (vUV - 0.1) / 0.8;
	vec2 vPixelPos = floor(vScreenUV * kResolution);

	vec3 col = mix(vec3(0.5, 1.0, 0.6), vec3(0.0, 0.5, 0.4), GetScreenPixel(vPixelPos/0.7));
	gl_FragColor = vec4( col, 1.0 );
}