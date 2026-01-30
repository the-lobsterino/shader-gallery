/*
 * Original shader from: https://www.shadertoy.com/view/tsGcRt
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

// shadertoy emulation
#define iTime time
#define iResolution resolution
vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
#define PI 3.141592654
// Color 1
vec3 a1 = vec3(0.5, 0.5, 0.5);
vec3 b1 = vec3(0.75, 0.55, 0.85);
vec3 d1 = vec3(0.0, 0.1, 0.2);
// Color 2
vec3 a2 = vec3(0.5, 0.5, 0.5);
vec3 b2 = vec3(0.75, 0.55, 0.85);
vec3 d2 = vec3(0.8, 0.9, 0.3);
// Color 3 - blue to gray
vec3 a3 = vec3(0.5, .5, 1.);
vec3 b3 = vec3(0.5, 0.5, 0.);
vec3 d3 = vec3(0., 0., 0.);
// Color 4 - black and white
vec3 a4 = vec3(1, 1, 1);
vec3 b4 = vec3(1.0, 1.0, 1.0);
vec3 d4 = vec3(1.0, 1.0, 1.0);

//vec3 col1 = a1 + b1 * cos(2.*PI*(sqrt(j) * COLOR_REPEAT*5. + d1 + c1));

vec3 col_1(float j, float repeat, vec3 offset)
{
    return a1 + b1 * cos(2.*PI*(sqrt(j) * repeat + d1 + offset));
}
vec3 col_2(float j, float repeat, vec3 offset)
{
    return a2 + b2 * cos(2.*PI*(sqrt(j) * repeat + d2 + offset));
}
vec3 col_3(float j, float repeat, vec3 offset)
{
    return a3 + b3 * cos(2.*PI*(sqrt(j) * repeat + d3 + offset));
}
vec3 col_4(float j, float repeat, vec3 offset)
{
    return a4 + b4 * cos(2.*PI*(sqrt(j) * repeat + d4 + offset));
}

#define AA 2
#define ITERATIONS 150.
#define COLOR_REPEAT 0.3
#define time iTime
#define MANIPULATED 1.

vec2 rot(vec2 p, vec2 pivot, float a)
{
    float s = sin(a);
    float c = cos(a);

    p -= pivot;
    p = vec2(p.x*c - p.y*s, p.x*s + p.y*c);
    p += pivot;

    return p;
}
float HexDist(vec2 p) {
    p = abs(p);

    float c = dot(p, normalize(vec2(1,1.73)));
    c = max(c, p.x);

    return c;
}
vec4 HexCoords(vec2 UV) 
{
    vec2 r = vec2(1, 1.73);
    vec2 h = r*.5;

    vec2 a = mod(UV, r)-h;
    vec2 b = mod(UV-h, r)-h;

    vec2 gv = dot(a, a) < dot(b,b) ? a : b;

    float x = atan(gv.x, gv.y);
    float y = .5-HexDist(gv);
    vec2 id = UV - gv;
    return vec4(x, y, id.x,id.y);
}
float TriangleDist(vec2 p, vec2 q )
{
    p.x = abs(p.x);
    vec2 a = p - q*clamp( dot(p,q)/dot(q,q), 0.0, 1.0 );
    vec2 b = p - q*vec2( clamp( p.x/q.x, 0.0, 1.0 ), 1.0 );
    float k = sign( q.y );
    float d = min(dot( a, a ),dot(b, b));
    float s = max( k*(p.x*q.y-p.y*q.x),k*(p.y-q.y)  );
    return sqrt(d)*sign(s);
}
// calculate light
// https://www.math.univ-toulouse.fr/~cheritat/wiki-draw/index.php/Mandelbrot_set#Normal_map_effect
float calc_light(vec2 z, vec2 der, float h, float angle)
{
    //float h = 1.3;  // height factor of the incoming light  
    //float angle = PI/5.;// + sin(time)*0.3; // incoming direction of light
    vec2 v = vec2 (cos(angle), sin(angle)); // unit 2D vector in this direction
    vec2 u = (1./(der.x*der.x + der.y*der.y))*vec2(z.x*der.x + z.y*der.y, z.y*der.x - z.x*der.y);// = z/der
    u = u/length(u); // normal vector: (u.re,u.im,1)
    float t = (u.x*v.x + u.y*v.y) + h; // dot product with the incoming light
    t = t/(1.+h); // rescale so that t does not get bigger than 1
    if(t<0.)
        t = 0.;
    float light = mix(1.,0.,t);
    return light;
}

vec3 iterate(vec2 UV , float distance_type, float manipulated)
{
    vec3 col;
	vec3 end_col = vec3(0.);
    float uv_rot_speed = time*0.1;
	UV += 0.5*vec2(sin(uv_rot_speed), cos(uv_rot_speed));
    vec2 z = UV;
    // shape = z for regular mandelbrot set
    // a; 0       ; (GOLDEN-2); 0.285; 0.285; 0.45  ; -0.70176; -0.835 ; -0.8 ; -0.7269; -0.754
    // b; 1-GOLDEN; (GOLDEN-1); 0    ; 0.01 ; 0.1428; -0.3842 ; -0.2321; 0.156; 0.1889; -0.066
    //float2 shapes[11] = {z, float2(0, 1-GOLDEN), float2(GOLDEN-2, GOLDEN-1), float2(0.285, 0.), float2(0.285, 0.01), float2(0.45, 0.1428), float2(-0.70176, -0.3842), float2(-0.835, -0.2321),
    //    				 float2(-0.8, 0.156), float2(-0.7269, 0.1889), float2(-0.754, -0.066)};
    vec2 shape;
    shape = vec2(0.285, 0.0103);
    //shape = vec2(-0.70176, -0.3842);
    //shape = z;

    vec2 dc = vec2(1.,0.);
    vec2 der = dc;
    vec2 prev_der;
    
    float r = 100.;

    float i = 0.;
    for(float ii = 0.; ii<ITERATIONS; ii++ )
    {

        
        if(manipulated == MANIPULATED) // left side
        {
        	//vec2 z2 = rot(z, vec2(0.), time*0.4);
        	//r = 2. + 1.*HexDist(0.5 + 2.*sin(cos(z2)*0.5)*cos(cos(z2*3.)));
            vec2 z1 = 10.*z/dot(z+0.2*cos(z+time*0.),z+0.2*sin(z+time*0.));
            vec2 z2 = rot(z1, vec2(0.), time*0.4);
            r = 10. + 15.*TriangleDist(sin(cos(z2*PI + PI)*0.5 + 5.)*sin(cos(z2*PI)), vec2(1000.,3.2));
        }
        
        /*float epsilon = 0.09;
        if(length(der) < epsilon)
        {
            end_col = vec3(0.1,0.3,0.6);
        }*/
        
        if(length(z) > r)
        {
            break;
        }

        // calculate derivative
        der = 2. * vec2(der.x*z.x - der.y*z.y, der.x*z.y + der.y*z.x) + dc;
        
        // calculate new z
        z = vec2(z.x * z.x - z.y * z.y, 2. * z.x * z.y) + shape;
        ++i;
    }

    if(i >= ITERATIONS)
    {
        end_col *= 0.;
    }
    else
    {
        float flicker = (0.5+0.7*(cos(sin(time*15.) + sin(cos(11.*time))) + sin(cos(5.*time))));
        float light = calc_light(z, der, 1.3, PI/5.);
        float light2 = calc_light(z, der,1.00, 1.5);
        light2 = pow(light2, 200. + 199.999*flicker);
        light2 = clamp(0.,1.,light2);
        float light3 = calc_light(z, der,1.00, 2.5);
        light3 = pow(light3, 1000. + 999.999*flicker );
        light3 = clamp(0.,1.,light3);
        float light4 = calc_light(z, der,1.00, 3.5);
        light4 = pow(light4, 1000. + 999.999*flicker);
        light4 = clamp(0.,1.,light4);
        //light *=(1.-light2)*(1.-light3)*(1.-light4);
        
        float fraciter = log2( log(length(z)) / log(r) );
        float j = i;
        if(manipulated != MANIPULATED) // right side
        {
        	j -= fraciter;
        }

        vec3 col1 = col_1(j, COLOR_REPEAT*1., vec3(time*0.3));
        //vec3 col12 = col_1(j, COLOR_REPEAT*20., vec3(time*3.));
        //vec3 col13 = col_1(j, COLOR_REPEAT*1.4, vec3(time*0.1));
        vec3 col2 = col_2(j, COLOR_REPEAT, vec3(time*0.5));
        //vec3 col22 = col_2(j, COLOR_REPEAT*5., vec3(time));
        //vec3 col3 = col_3(j, COLOR_REPEAT, vec3(time*0.5));
        //vec3 col4 = col_4(j, COLOR_REPEAT, vec3(time*0.));

        //end_col = vec3(sqrt(j*0.01));
        //end_col = col4 * pow(light,1.) + col12*(pow(1.-light,2000.));
        end_col = col1*light + col2*(light2 + light3 + light4);//col22*light2 + col22*light3;
        //end_col = vec3(light2);
        
        float leaves = smoothstep(0.2,2.,fraciter);
        //float leaves_edges = smoothstep(0.3,0.,fraciter);
        //float leaves_edges_tips = smoothstep(-0.02,0.03,fraciter);
        //leaves_edges *= leaves_edges_tips;
        if(manipulated == MANIPULATED) // left side
        {
        	end_col *= leaves*1.3;
        }
    }
	
    return end_col;
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv;// = fragCoord/iResolution.xy;
    vec2 uv2 = (fragCoord-.5*iResolution.xy)/iResolution.y;
    float a = MANIPULATED;
    vec2 b = (iMouse.xy-.5*iResolution.xy)/iResolution.y;
    if(uv2.x > b.x) {a = 0.;}
    //if(uv2.y > b.y) {a.y = 1.;}
    
    float zoom = 1. + 0.8*sin(sin(time*0.1))*cos(time*0.2);

    #if AA
    vec3 col = vec3(0.);
    // anti-aliasing from https://www.shadertoy.com/view/Mss3R8
	for( int j=0; j<AA; j++ )
	for( int i=0; i<AA; i++ )
	{
		vec2 of = -0.5 + vec2( float(i), float(j) )/float(AA);

        uv = (fragCoord+of)/iResolution.xy;
        uv*=zoom;
        uv.x-= zoom/2.;
        uv.y -= zoom/2.;
	   col += iterate( uv, 20., a);
	}
	col /= float(AA*AA);
    
    #else
    
    uv = fragCoord/iResolution.xy;
    uv*=zoom;
    uv.x-= zoom/2.;
    uv.y -= zoom/2.;
	vec3 col = iterate(uv, 20., a);
    
    #endif
    
    float mouseClicked = iMouse.w > 0. ? 0.12 : 0.;
    vec3 vline = exp(-80.*length(uv2.x-b.x))*vec3(1.,1.,1.); // vertical line
    /*vec3 lineCol = texture(iChannel1,uv*0.05
                           + mouseClicked*vec2(time*0.5,time)
                           + vec2(time*0.01, time*0.02)).xyz;
    lineCol = (lineCol)*3.*vec3(0.8,1.,0.4);*/
    col *= 1.-vline;
    col += vline;
    //col += vline*lineCol;
    

    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    iMouse = vec4(mouse * resolution, 0., 0.);
    mainImage(gl_FragColor, gl_FragCoord.xy);
}