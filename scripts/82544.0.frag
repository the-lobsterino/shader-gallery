#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec2 triangle_wave(vec2 a){
    return abs(fract((a+vec2(1.,0.5))*1.5)-.5);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    fragColor = vec4(0.0);
    vec3 col = vec3(0.4);
    float t1 = 1.5;//iResolution.y/iResolution.x;
    vec2 uv = (fragCoord)/resolution.y/t1/2.0 + vec2(0.0,-time*0.1)/t1/16.0;
    vec2 t2 = vec2(0.45);
    for(int k = 0; k < 7; k++){
        float p1 = sign(uv.x);
        t2 *= (1.+p1)/2.;
        uv = (uv+t2)/1.602;
        t2 = -p1*triangle_wave(uv-.5);
        uv = t2-p1*triangle_wave(uv.yx);
        vec2 uv1 = uv+triangle_wave(uv.yx+time/4.)/4.;
        col.x = min(p1*(uv1.y-uv1.x),col.x)+col.x;
        col = abs(col.yzx-vec3(col.x)/(3.));
    }
    fragColor = vec4(col*3.,1.0);
}


void main( void ) {
	
	mainImage(gl_FragColor,gl_FragCoord.xy);

}

