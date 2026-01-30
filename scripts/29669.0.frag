#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define EPSILON .00000001
#define lineWidth .5
#define lineCap 0

/* this is a visualization of a question on an SAT test as explained in this youtube video: https://www.youtube.com/watch?v=kN3AOMrnEUs
 * The question was as follows:
 * There are two circles. One is circle a and one is circle b
 * circle a had the radius equal to one third of the radius of circle b
 * if circle a rotated around circle b as shown in this shader, how many times would circle a need to rotate
 * before it is able to make a complete round ending the same place as where is started.
 * One would figure it out this way: (at least I did)
 * 
 * PI = 3.1415...
 * circumference = 2PIr
 * 
 * let a be the radius of circle a
 * let b be the radius of circle b
 * a = b / 3
 * let r be the amount of rotations circle a did around circle b
 * r = 2PIb / 2PIa
 *   = 2PIb / 2PI(b / 3.)
 *   = b / (b / 3.)
 *     b   3
 *   = - * -
 *     1   b
 *     3b
 *   = --
 *     b
 *   = 3
 * therefore the amount of rotations circle a did around circle b is 3
 * seems logical? but it is wrong. This would be true if circle b was a straight line the length of 
 * the circumfrace of circle b but since circle b in infact also a circle so the correct answer
 * would be r + 1. I advise you to watch the youtube video.
 *
 * In code, this is defined as: 
 * divideBy + 1.
 * located at lines 122 and 123
 * fiddle around with some of the variables and quickely it will become apparent that
 * removing '+ 1' would make it look wrong especially if you change divideBy to 1.
 */

vec2 pos;
vec4 currentColor = vec4(1);

void render(float pixel, vec4 col){
    if (pixel <= 0.){
        gl_FragColor = mix(gl_FragColor, col, col.w);
    }else if (pixel < 1.){
        gl_FragColor = mix(gl_FragColor, col, col.w * (1. - pixel));
    }
}

void render(float pixel){
    render(pixel, currentColor);
}

void drawLine(vec2 p1, vec2 p2){
    vec2 delta = p2 - p1;
	float len = length(delta);
	float dist = abs(delta.y * pos.x - delta.x * pos.y + p2.x * p1.y - p2.y * p1.x) / len;
	
	vec2 center = (p1 + p2) / 2.;
	vec2 perp2 = vec2(center.y - p1.y, p1.x - center.x) + center;
	
	float cDist = abs((perp2.y - center.y) * pos.x - (perp2.x - center.x) * pos.y + perp2.x * center.y - perp2.y * center.x) / len * 4.;
	
	if (cDist > len){
		if (lineCap == 1){
		    dist = min(length (p1 - pos), length (p2 - pos)) - lineWidth;
		}else{
		    dist = max(dist - lineWidth, cDist - len);
		}
	}else{
		dist -= lineWidth;
	}
	
	render(dist);
}

void main( void ) {
	pos = gl_FragCoord.xy * 2.0 - 1.0;
    	pos.y = resolution.y - pos.y;

	const float pi = 3.141592653;
	vec2 p = vec2(100, 100);
	vec2 p2 = p + vec2(100);
	vec2 p3 = p2 + vec2(100.0,0.0);
	vec2 pn = normalize(-p3 - p2);
	float radian = atan(pn.y, pn.x) + 0.5 * pi;
	float radian2 = radian + pi;
	vec2 pt  = p2 + (vec2(sin(radian), cos(radian)) * 100.0);
	vec2 pt2 = p2 + (vec2(sin(radian2), cos(radian2)) * 100.0);
	drawLine(p, p2);
	drawLine(p2, p3);
	drawLine(p2, pt);
	drawLine(p2, pt2);
}