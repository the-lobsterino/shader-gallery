#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define SCROLL_SPEED  0.1
float GetScroll()
{
	return 2.0 * fract((time * SCROLL_SPEED) / 2.0);
}

float Func01(float x)
{
	return x * x - 2.0 * x + 0.4;	
}

float Func02(float x)
{
	return x +  0.4;	
}

float Func03(float x)
{
	return x * x * x - 2.0 * x * x + 0.1 * x + 0.1;	
}

float GetColorAt(float fX, float y)
{	
	float distY = abs(fX - y);
	distY = clamp(distY * 100.0, 0.0, 1.0);
	return 1.0 - distY;
}



void main( void ) 
{
	
	// gl_FragCoord.xy - position of the pixel on the screen, for example X: (0 - 1280), Y: (0 - 960)
	// resolution.xy - actual screen resolution, for example (1280, 960)
	
	// 1.
	// normalizedCoord now has values in the [0, 1] range in both X and Y directions
	vec2 normalizedCoord = ( gl_FragCoord.xy / resolution.xy );
	// Let's put this on the screen!
	gl_FragColor.xy = normalizedCoord;

	// 2.
	// signedCoord now has values in the [-1, 1] range in both X and Y directions
	vec2 signedCoord = 2.0 * normalizedCoord - 1.0; 
	// Let's put this on the screen!
	gl_FragColor.xy = signedCoord;

	// 3.
	vec3 color = vec3(0.0, 0.0, 0.0);
	color.r += (GetColorAt(Func01(signedCoord.x + GetScroll()), signedCoord.y)); 

	color.g += (GetColorAt(Func02(signedCoord.x + GetScroll()), signedCoord.y)); 

	color.b += (GetColorAt(Func03(signedCoord.x + GetScroll()), signedCoord.y)); 
	
	gl_FragColor = vec4(color, 1.0); 
	
	// 4.
	// Maybe visualize the mouse
	// Also try gl_FragColor.xy = mouse;
	float distanceToMouse = length(gl_FragCoord.xy - mouse * resolution.xy);
	gl_FragColor.z += 1.0 - smoothstep(0., 1., pow(distanceToMouse * 0.06, 5.0));

}