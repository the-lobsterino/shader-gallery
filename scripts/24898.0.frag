#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Created by inigo quilez - iq/2013 : https://www.shadertoy.com/view/4dl3zn
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// Messed up by Weyland
// Messed up by Y20: Added polygonal bokeh effect (as done in Sousa 2013 (Crytek's depth of field))

const float POLYGON_SIDE_COUNT = 8.0;
const float PI = 3.1415926535;
const float theta_side = 2.0*PI/POLYGON_SIDE_COUNT;

float morphRadiusToPolygon(vec2 uv, vec2 pos)
{
	float angle = atan((uv-pos).y, (uv- pos).x);
	float angle_on_side = mod(angle, theta_side);
	float distance_to_side = sin((PI-theta_side)/2.0)/sin(PI-angle_on_side-(PI-theta_side)/2.0);
	return distance_to_side;
}

void main(void)
{
	vec2 uv = -1.0 + 2.0*gl_FragCoord.xy / resolution.xy;
	uv.x *= resolution.x / resolution.y;

    // background	 
//	vec3 color = vec3(0.9 + 0.2*uv.y);
	vec3 color = vec3(0.0);

    // bubbles	
	for( int i=0; i<64; i++ )
	{
        // bubble seeds
		float pha =      sin(float(i)*546.13+1.0)*0.5 + 0.5;
		float siz = pow( sin(float(i)*651.74+5.0)*0.5 + 0.5, 4.0 );
		float pox =      sin(float(i)*321.55+4.1) * resolution.x / resolution.y;

        // buble size, position and color
		float rad = 0.01 + 0.01*siz+sin(time/6.+pha*500.+siz)/20.;
		vec2  pos = vec2( pox+sin(time/10.+pha+siz), -1.0-rad + (2.0+2.0*rad)
						 *mod(pha+0.1*(time/5.)*(0.2+0.8*siz),1.0));
		
		vec3  col = mix( vec3(0.194*sin(time/6.0),0.3,0.0), 
						vec3(1.1*sin(time/9.0),0.4,0.8), 
						0.5+0.5*sin(float(i)*1.2+1.9));
		      
		
        // render
		rad *= morphRadiusToPolygon(uv,pos);
		float f = length(uv-pos)/rad;
		f = sqrt(clamp(1.0-f*f,0.0,1.0));
		color += col.zyx * f;
	}

    // vigneting	
	//color *= sqrt(1.5-0.5*length(uv));

	gl_FragColor = vec4(color,1.0);
}