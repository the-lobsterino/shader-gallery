#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 blackbody(float t){
    // http://en.wikipedia.org/wiki/Planckian_locus

    const vec4 vx = vec4(-0.2661239e9,-0.2343580e6,0.8776956e3,0.179910);
    const vec4 vy = vec4(-1.1063814,-1.34811020,2.18555832,-0.20219683);
    float it = 1./t;
    float it2= it*it;
    float x = dot(vx,vec4(it*it2,it2,it,1.));
    float x2 = x*x;
    float y = dot(vy,vec4(x*x2,x2,x,1.));
    float z = 1. - x - y;
    
    // http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
    const mat3 xyzToSrgb = mat3(
         3.2404542,-1.5371385,-0.4985314,
        -0.9692660, 1.8760108, 0.0415560,
         0.0556434,-0.2040259, 1.0572252
    );

    return max(vec3(x/y,1.,z/y) * xyzToSrgb, 0.0);
}

vec3 blackbody2(float temp)
{
	float tp = pow(temp, -1.5);
	float lt = log(temp);
	
	vec3 col = vec3(1.);
    	col.r = 220000.0 * tp + 0.58039215686;
   	col.g = temp > 6500. ? 138039.215686 * tp + 0.72156862745 : 0.39231372549 * lt - 2.44549019608;
   	col.b = 0.76149019607 * lt - 5.68078431373;
	
   	return col;
}

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;

	vec3 color = blackbody2(1000.0 / position.x);

	gl_FragColor = vec4(color, 1.0 );

}