#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// -------------------------------------------------------------------------

#define iResolution resolution
#define iMouse mouse

// original url https://www.shadertoy.com/view/fty3W3

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.xy;
	
    // Triangle vertex coordinates
	vec2 p[3];
    p[0] = vec2(0.15,0.15);
    p[1] = vec2(0.85,0.15);
    p[2] = vec2(0.85,0.85);
    // Click the image to move one of the points
    //if (iMouse.x>0.) {
    //  p[2] = iMouse.xy/iResolution.xy;
    //}
	
    // Computing barycentric coordinates
	float t11 = p[1].x - p[2].x;
	float t12 = p[0].x - p[2].x;
	float t21 = p[1].y - p[2].y;
	float t22 = p[0].y - p[2].y;
	float detT = t11*t22 - t12*t21;
	float l1 = (t22*(uv.x-p[2].x) - t12*(uv.y-p[2].y))/detT;
	float l2 = (-t21*(uv.x-p[2].x) + t11*(uv.y-p[2].y))/detT;
	float l3 = 1. - l1 - l2;
	
    // Drawing just the border
    float minSign = min(sign(l1),min(sign(l2),sign(l3)));
	float v = clamp(exp(-abs(l1*l2*l3)*256.) * minSign, 0., 1.);
	fragColor = vec4(l1*v, l2*v, l3*v, 1.0);
}

// -------------------------------------------------------------------------

void main( void ) {

	mainImage(gl_FragColor,gl_FragCoord.xy);
}