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

void drawOval (vec2 center, vec2 r){
    vec2 norm = pos - center;
    float len = length(norm);
    float c = norm.y / len;
    float div = length(vec2(r.x * c, r.y * sin(acos(c))));
    
    if (div > EPSILON){
        float dist = length (norm / len * (r.x * r.y) / div - norm);
        
        render(dist - lineWidth);
    }
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
	pos = floor(gl_FragCoord.xy);
    	pos.y = resolution.y - pos.y;
	
	vec2 c = resolution / 2.;
	
	float divideBy = 3.;
	
	float radius = 100.;
	float radiusd3 = radius / divideBy;
	
	drawOval(c, vec2(radius));
	drawLine(c - vec2(0, radius), c + vec2(0, radius));
	drawLine(c - vec2(radius, 0), c + vec2(radius, 0));
	
	
	float stheta = sin(time);
	float ctheta = -cos(time);
	
	vec2 c2 = c + vec2(stheta * (radius + radiusd3), ctheta * (radius + radiusd3));
	
	stheta = sin(time * (divideBy + 1.));
	ctheta = -cos(time * (divideBy + 1.));
	
	drawOval(c2, vec2(radiusd3));
	drawLine(c2 - vec2(radiusd3 * stheta, radiusd3 * ctheta), c2 + vec2(radiusd3 * stheta, radiusd3 * ctheta));
	drawLine(c2 - vec2(radiusd3 * -ctheta, radiusd3 * stheta), c2 + vec2(radiusd3 * -ctheta, radiusd3 * stheta));
}