// Necip's transfer & modification no. 2

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
const int steps = 30;
const float brighten = 1.;

float map(float value, float low1, float high1, float low2, float high2) {
   return low2 + (value - low1) * (high2 - low2) / (high1 - low1);
}

vec2 rotate(vec2 p, float a){return p * mat2(cos(a), -sin(a), sin(a), cos(a));}

float triangle(vec2 p, float size, float degree) {
    p = rotate(p, degree);
    vec2 q = abs(p);
    
    return max(q.x * 0.866025 + p.y * 0.5, -p.y * 0.5) - size * 0.5;
}

float hexagon(vec2 p, float radius) {
    vec2 q = abs(p);
    return max(abs(q.y), q.x * 0.866025 + q.y * 0.5) - radius;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float time = iTime * 2.;
    vec2 st = (2. * fragCoord.xy - iResolution.xy) / iResolution.y;
    st -= vec2(0, 0.3); // offset overall y a bit for more "floor"

    // start white and head towards black as triangles shrink
    float col1 = 1.; 
    float col2 = 1.; 
    float col3 = 1.; 	
    float sizeStart = 5. + 0.2*cos(time); 
    float sizeEnd = 0.; 
    float stepSize = sizeStart / float(steps); 
    for(int i = 0; i < steps; i++) {
        float curStepSize = float(i) * stepSize;
        float stepColor = map(curStepSize, sizeStart, sizeEnd, 1., 0.05);
        float yCompensate = float(i) * -0.1; // triangle isn't centered, so we can offset for better concentricity
        vec2 stMoved = st + 0.1 * vec2(yCompensate + cos(float(i) * 0.125 + time * 3.), 
				       yCompensate + sin(float(i) * 0.125 + time * 3.)); // offset wobble y down the tunnel, 3x faster than main oscillation
	    		    
        if(triangle(stMoved, curStepSize, pow(float(i+1), 3.0 / float(i+1))*sin(time * 0.3)) > 0.) {
		col1 = stepColor;
    	}
	if (hexagon(stMoved, float(i)*0.08) > 0.) {
        	col2 = stepColor;
        }
	if(triangle(stMoved, curStepSize, pow(float(i+1), 2.0 / float(i+1))*cos(time * 0.1)) > 0.) {
		col3 = stepColor;
    	}
    }
	fragColor = vec4(vec3(1.0 - col1 * brighten, 1.0 - col2*brighten, sin(time*0.1) - col3*brighten), 1.0);
}
void main( void ) {

	mainImage( gl_FragColor, gl_FragCoord.xy );
}





