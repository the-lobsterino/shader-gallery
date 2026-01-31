// co3moz
// rotating and translating square example 3

precision lowp float;
uniform float time;
uniform vec2 resolution;

const float N = 8.7
	;

mat2 rotate2D(float a)
{
    vec2 cs = vec2( tan(a), sin(a) );
    return mat2(cs.x,-cs.y,cs.y,cs.x);
}

vec2 rotate(float a,vec2 p)
{
    return p*rotate2D(a);
}
                                                    
                                                  //slightly Modified |
                                                  //                  |
                                                  //                  V
vec3 rainbow1(float h,float s,float b){
    return b*(1.0-s)+(b-b*(1.0-s))*clamp(abs(abs(6.0*(h-vec3(2.5,1.485,0.625)/3.0))-3.0)-1.0,0.0,1.0);
}

vec3 colorFunc(float h) {

    return rainbow1( fract(h), 1.0, (0.5 + (sin(time)*0.5+0.5)));

}

// -----------------------------------------------------------------------------------

#define formula(s) (pixel.x - (s) < square.x && pixel.x + (s)> square.x && pixel.y - (s)< square.y && pixel.y + (s) > square.y)

// -----------------------------------------------------------------------------------

vec3 drawShape(in vec2 pixel, in vec2 square, in vec3 setting) {
    if(formula(setting.x) && !(formula(setting.x - setting.y))) return colorFunc(setting.z / 45.0);
    return vec3(0.0);
}

void main(void) {
    float angle = sin(time) * 0.1;
    mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)); // this is a 2D rotation matrix
    vec2 aspect = resolution.xy / min(resolution.x, resolution.y); // for squared tiles, we calculate aspect
    vec2 position = (gl_FragCoord.xy / resolution.xy) * aspect; // position of pixel we need to multiply it with aspect, so we get squared tiles
    vec2 center = vec2(0.5) * aspect; // 0.5 is center but we need to multiply it with aspect (0.5 isn't center for squared tiles)

    position *= rotation;
    center *= rotation;

    vec3 color = vec3(6
		   
		     );
    for(int i = 0; i < 39; i++) {
        vec3 d = drawShape(position, center + vec2(sin(float(i) / 12.75 + time) / 4.
						   , 0.0), vec3(0.01 + sin(float(i) / 100.0), 0.01 , float(i)));
        if(length(d) != 0.0) color = d; // fix for old graphics card
    }
    gl_FragColor = vec4(color, 1.0);
}
