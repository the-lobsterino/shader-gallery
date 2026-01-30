// Necip's transfer & modification no 3 / 05.04.20
// Yin & Yang

#define iTime	time
#define iResolution resolution

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
// triangle shape from: https://thebookofshaders.com/edit.php?log=160414041142

const float TWO_PI = 6.28318530718;
const int steps = 100;
const float brighten = 1.5;

float map(float value, float low1, float high1, float low2, float high2) {
   return low2 + (value - low1) * (high2 - low2) / (high1 - low1);
}

vec2 rotate(vec2 p, float a){return p * mat2(cos(a), -sin(a), sin(a), cos(a));}

float triangle(vec2 p, float size, float degree) {
    p = rotate(p, degree);
    vec2 q = abs(p);
    
    return max(q.x * 0.866025 + p.y * 0.5, -p.y * 0.5) - size * 0.5;
}


float square(vec2 p, float radius) {
	float degree = sin(time);
	 p = rotate(p, degree);
    vec2 q = abs(p);
	return sqrt((q.x - radius) + (q.y - radius));
}

float circle(vec2 p, float radius) {
	// vec2 q = abs(p);
    return distance(p,vec2(radius));
}


float hexagon(vec2 p, float radius) {
	float degree = sin(time);
	 p = rotate(p, degree);
    vec2 q = abs(p);

    return max(abs(q.y), q.x * 0.866025 + q.y * 0.5) - radius;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float time = iTime * 2.;
    vec2 st = (3. * fragCoord.xy - iResolution.xy) / iResolution.y;
    // st -= vec2(0, 0.3); // offset overall y a bit for more "floor"

    // start white and head towards black as triangles shrink
    float col1 = 1.; 
    float col2 = 1.; 	
    float sizeStart = 0.; // 0.4*cos(time); 
    float sizeEnd = 0.; 
    float stepSize = sizeStart / float(steps); 
    //for(int i = 0; i < steps; i++) 
	int i=0;
    {
        float curStepSize = float(i) * stepSize;
        float stepColor = map(curStepSize, sizeStart, sizeEnd, 1., 0.05);
        float yCompensate = float(i) * -0.22; // triangle isn't centered, so we can offset for better concentricity
        vec2 stMoved = st + 0.1 * vec2(0, yCompensate + sin(float(i) * 0.125 + time * 3.)); // offset wobble y down the tunnel, 3x faster than main oscillation
	    	
        col1 = circle(stMoved+ 1.5*vec2(sin(time), cos(time)), float(i+1)*.01); 
        col2 = circle(stMoved+ 1.5*vec2(cos(time), sin(time)), float(i+1)*.01); 
    }
	
	float col = (mix(col1,col2, col1*col2)); // * brighten;
	fragColor = vec4(vec3(col), 1.0);
}
void main( void ) {

	mainImage( gl_FragColor, gl_FragCoord.xy );
}





