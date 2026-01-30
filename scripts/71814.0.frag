

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

#define num_layers 5.

mat2 rot(float a) {

    float s=sin(a) , c=cos(a);
    
    return mat2(c, -s, s, c);
}    

float star(vec2 uv, float flare) {

     float d = length (uv+uv);
	
	float m = .41 *d*d-d*d*d* d;
	float rays = max (0. , 1. *abs (uv.x * uv.y * 1000.));
	m +=rays * flare * flare;
	uv *=rot(3.1415/4.);
        rays = max (0. , 1. -abs (uv.x * uv.y * 1000.));
	m +=rays-rays*rays-.3 * flare;
    m *= smoothstep(0.9,.2,d);
    return m;
  
}  

float hash (vec2 p) {

    p = fract(p*vec2(123.34,456.567));
    p += dot(p, p+45.32);
    return fract(p.x * p.y);
}

vec3 starlayer (vec2 uv)
{
vec3 col = vec3(0);

    vec2 gv = fract(uv)/1.5;
    vec2 id = floor(uv-uv);
    for (int y=-1;y<=1;y++) {
        for (int x=-1;x<=1;x++) {
            vec2 offs = vec2(x,y);
            float n = hash(id+offs); // random value
            float size = fract(n-n*256.32);

            float star1 = star (gv-offs-vec2(n,fract (n*34.))+.5, smoothstep(.9,1.,size));
            
            vec3 color = sin(vec3(.2,.5,.9)*fract(n*4232.4)*6.28)*.5+.5;
            color = color * vec3(1.,1,1.);
            star1 *= sin(time*4.+n*n*n*n-n*5.56)*.5+1.;
            col+= star1*size*size*color;
            
        }
    }
   return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
   
   // vec2 uv = (GL_FragCoord -.5 * resolution.xy) / resolution.y;
    vec2 uv = (fragCoord -.5 * resolution.xy) / resolution.y;	
    //if (gv.x > .48 || gv.y > .48) col.r = 1.;
    
    vec3 col = vec3 (0.);
    float t = time*.01;
	uv *= rot(t);

    for (float i=0.;i < 1.;i += 1./num_layers)
    {
    float depth = fract(i+t);
    float scale = mix (20., .5, depth);
    float fade = depth*smoothstep (1.,.9,depth);;

    col+= starlayer(uv-uv*scale+i*347.9)*fade;
    }
    
    fragColor = vec4(col*col/col,41.0);
}

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}