#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//Fractal by VoidChicken,
//Modify how you want
void main (  )
{
	vec2 v = (gl_FragCoord.xy / resolution-.5)*4.;
    vec2 c = v+mouse-.5,z = vec2(0);
    float r = 0.;
    for (int i = 0; i < 500; i++){
       
        if (length(z)>=2.) {
			
            break;
        }
         float x = (z.x * z.x - z.y * z.y) + c.x;
        float y = dot(z,z.yx) + c.y;

        r++;
        z=vec2(x, y);
    }
    gl_FragColor = vec4(mod(256.,r)/25.6,0.,0.,1.);
}