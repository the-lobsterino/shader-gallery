#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co) {
                float a = fract(dot(co, vec2(2.067390879775102, 12.451168662908249))) - 0.5;
                float s = a * (6.182785114200511 + a * a * (-38.026512460676566 + a * a * 53.392573080032137));
                float t = fract(s * 43758.5453);
                return t;
            }


void main( void ) {

    // normalized xy （0.0 〜 1.0）
    vec2 uv = gl_FragCoord.xy / resolution.xy;
	
	uv.y+=999.9;
	
	
	float split = 10.0;
	
	//for animation
	vec2 offset = vec2(0.0,floor(split*time));
	
	//pixelate random value
	float r = rand( floor( (uv+offset) * split) / split );
	
	//using mosaic random value,
	//decided the last pixelate size
	float size = split * pow(2.0,floor( r * 6.0 ));
	
	//pixelate
	vec2 uvv = floor(uv*size)/size;
	
	
    // output
    gl_FragColor = vec4(
	    rand(uvv.xy),
	    rand(uvv.xy),
	    rand(uvv.yx+vec2(0.0,0.1)),
	    1.0
    );

}