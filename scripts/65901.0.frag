/*
 * Original shader from: https://www.shadertoy.com/view/wtByzh
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
/*

	Heptagon-Pentagon Tiling
	------------------------

	You can learn a lot from looking a stock images on the internet.
	This particular aesthetic is my own, but it encompasses a few
	simple tricks -- Colorful highlights, vector borders and weird
	canvas coordinate manipulation. All are very simple to produce.

	This is a heptagon and pentagon tiling arrangement that you may
	have seen around. I have a nice neat example somewhere, but I 
	couldn't find it, so I've hacked in a function from an extruded
	3D tiling I made a while back that needs a bit of a tidy up. By
	the way, I'll post that too at some stage.

	The tiling method I've used is OK, but there are better ways to 
    produce a heptagon pentagon tiling, so I wouldn't pay too much
	attention to it. Having said that, it works, and will work in	
	an extruded 3D setting as well.

	I've used a standard circle inversion based transformation to mix
	things up a bit and give some extra perspective.


*/

// Show the individual tile boudaries.
//#define SHOW_GRID

// Perform a coordinate transform. Commenting this out will show
// the regular pattern.
#define TRANSFORM

// Standard 2D rotation formula.
mat2 rot2(in float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }


// IQ's vec2 to float hash.
float hash21(vec2 p){  return fract(sin(dot(p, vec2(27.619, 57.583)))*43758.5453); }



// Signed distance to a regular pentagon -- Based on IQ's pentagon function.
float sdHeptagon( in vec2 p, in float r){
    
    const vec3 k = vec3( .9009688679, .43388373911, .4815746188); // pi/5: cos, sin, tan
    p.y = -p.y;
    p.x = abs(p.x);
    p -= 2.*min(dot(vec2(-k.x, k.y), p), 0.)*vec2(-k.x, k.y);
    p -= 2.*min(dot(vec2(k.x, k.y), p), 0.)*vec2(k.x, k.y);
    p -= 2.*min(dot(vec2(-k.x, k.y), p), 0.)*vec2(-k.x, k.y);
	p -= vec2(clamp(p.x, -r*k.z, r*k.z), r);    
    return length(p)*sign(p.y);
    
}

// Convex pentagon routine -- Adapted from IQ's triangle routine. 
float sdPent(in vec2 p, in vec2 v[5]){
    
    vec2 e[5];
    for(int i = 0; i<4; i++) e[i] = v[i + 1] - v[i];
    e[4] = v[0] - v[4];
   
    float s = sign( e[0].x*e[4].y - e[0].y*e[4].x );
    vec2 d = vec2(1e5);
    
    for(int i = 0; i<5; i++){
        v[i] = p - v[i];
        vec2 pi = v[i] - e[i]*clamp( dot(v[i], e[i])/dot(e[i], e[i]), 0., 1.);
        d = min(d, vec2(dot(pi, pi), s*(v[i].x*e[i].y - v[i].y*e[i].x)));
    }

	return -sqrt(d.x)*sign(d.y);
}


// Some constants that help determine the geometry. This is a messy function. I have a 
// cleaner one somewhere, so I'll drop that in at some stage. These are just heptagon
// and pentagon heights, widths and apothems (center to mid edge point).
const float PI = 3.14159;
const float rad7 = .5;
const float apothem7 = (rad7*cos(PI/7.));
const float side7 = rad7*sin(PI/7.)*2.;
const float width7s = side7*cos(2.*PI/7.);
const float width7 = (side7*cos(PI/7.) + side7/2.);
const float yDiff = (2.*apothem7*sin(.5*PI/7.));
const float h = sqrt(apothem7*apothem7*4. - (width7 + width7s)*(width7 + width7s));

const vec2 s = vec2(width7*2. + width7s*2., (apothem7 + apothem7 + h));
const vec2 s2 = s*vec2(1, 2);
const float yh = s.y - apothem7 - rad7;


vec2 pL = vec2(0.);
float pDots = 0.;

// The heptagon-pentagon distance field. By the way, I poached this from a 3D extruded 
// tiling example, so you can actually render this in a more efficient manner in 2D.
vec4 distField(vec2 p){
    
    
    // Shape distance field holder. There are six in all. Four heptagons and two pentagons.
    float pl[6];
    // Centers of the six individual polygons that represent a single tile. Use the show
    // grid borders option to see more clearly.
    vec2 pCntr[6]; 
    pCntr[0] = vec2(0, 0);
    pCntr[1] = vec2(width7s + width7, yDiff);
    pCntr[2] = vec2(0, -apothem7*2.);
    pCntr[3] = vec2(width7s + width7, apothem7*2. + yDiff);
    pCntr[4] = vec2(0, yDiff/2.);
    pCntr[5] = vec2(0, yDiff/2.);
    
    // Shape IDs and local coordinates.
    vec2 ip[6];
    vec2 pLoc[6];
    
    // Using the information above to produce four heptagons.
    vec2 oP = p - pCntr[0];
    ip[0] = floor(p/s2);
    p = mod(p, s2) - s2/2.;
    pLoc[0] = p;
    pl[0] = sdHeptagon(p, apothem7);
   
    p = oP - pCntr[1];
    ip[1] = floor((p)/s2);
    p = mod(p, s2) - s2/2.;
    pLoc[1] = p;
    pl[1] = sdHeptagon((p)*vec2(1, -1), apothem7); 
    
    p = oP - pCntr[2];
    ip[2] = floor((p)/s2);
    p = mod(p, s2) - s2/2.;
    pLoc[2] = p;
    pl[2] = sdHeptagon((p)*vec2(1, -1), apothem7); 
    
    p = oP - pCntr[3];
    ip[3] = floor((p)/s2);
    p = mod(p, s2) - s2/2.;
    pLoc[3] = p;
    pl[3] = sdHeptagon(p, apothem7); 


    // Producing the two pentagons, plus some outer vertex dots.
    p = oP - pCntr[4];
    ip[4] = floor((p)/s);
    
    
    if(mod(ip[4].y, 2.)<.5){
       p.x -= s.x/2.;
       ip[4] = floor((p)/s);
    }

    p = mod(p, s) - s/2.;
    
    ip[5] = ip[4];
   
    // Pentagon vertices.
    vec2 v[5];
    v[0] = vec2(-s.x/2. + side7/2., 0);
    v[1] =  v[0] + rot2(-PI*2./7.)*vec2(side7, 0);
    v[2] = vec2(0, yh);
    v[3] = vec2(0, -yh);
    v[4] =  v[0] + rot2(PI*2./7.)*vec2(side7, 0);
    
    // Pentagon one.
    pl[4] = sdPent(p, v);
    
    pCntr[4] = (v[0] + v[1] + v[2] + v[3] + v[4])/5.;
    
    // The pentagon outer dots.
    pDots = 1e5;
    for(int i = 0; i<5; i++){
      pDots = min(pDots, length(p - v[i]));
    }
    
    pLoc[4] = p - pCntr[4];
  
    // Pentagon two. Same vertices, but with the local coordinates mirrored
    // acress the X-axis.
    pl[5] = sdPent(p*vec2(-1, 1), v);
    pLoc[5] = p;
    pCntr[5] = (v[0] + v[1] + v[2] + v[3] + v[4])*vec2(-1, 1)/5.;
    pLoc[5] = p - pCntr[5];
    
    // Other pentagon outer dots.
    for(int i = 0; i<5; i++){
      pDots = min(pDots, length(p*vec2(-1, 1) - v[i]));
    }    
    
    // Iterate through each of the six polygons, then return the minimum
    // distance, local coordinates, ID, etc.
    float minD = 1e5;
    vec2 pID = vec2(0);
    vec2 si = s2;
    
    int cID; 
    for(int i = 0; i<6; i++){
        
        if(i>3) si = s;
        if(pl[i]<minD){
            
             minD = pl[i];
             pID = ip[i]*si + pCntr[i];
             cID = i;
             pL = pLoc[i];
           
        }
        
    } 
    
    // Retrun the minimum distance, shape center ID, and shape number.
    return vec4(minD, pID, cID);
}

// The tile grid borders. Alternate rows are offset by
// half a grid cell.
float gridField(vec2 p){
    
    vec2 ip = floor(p/s);
    if(mod(ip.y, 2.)<.5) p.x += s.x/2.;
    ip = floor(p/s);
    p = abs(mod(p, s) - s/2.);
    return abs(max(p.x - .5*s.x, p.y - .5*s.y)) - .01;
}


void mainImage(out vec4 fragColor, in vec2 fragCoord){

    // Aspect correct screen coordinates.
	vec2 uv = (fragCoord - iResolution.xy*.5)/iResolution.y;
   
   
    // For all intents and purposes, this is just a fancy coordinate transformation.  For 
    // instance, "uv = vec2(log(length(uv)), atan(uv.y, uv.x)/PI/2.*(width7 + width7s)*2.5)" 
    // will polar transform things, and something like "uv.y += sin(uv.x*a)*b" will make
    // things look wavy. This particular one is a cool circle inversion formula that people 
    // like MLA, S2C, Mattz, etc, use when they're putting together hyperbolic geometry and 
    // so forth. On a side note, I'll be putting a couple of those up pretty soon. 
    #ifdef TRANSFORM
    // I can't remember who uses this particular style (MLA?), but many use it, and it's the 
    // one I prefer.
    //vec2 m = vec2((2.*iMouse.xy - iResolution.xy)/iResolution.y);
    vec2 m = vec2(cos(iTime/8.), -sin(iTime/4.))*.5;
    float k = 1./dot(m, m);
    vec2 c = k*m; // Circle inversion.
    float tk = (k - 1.)/dot(uv - c, uv - c);
    uv = tk*uv + (1. - tk)*c;
    uv.x = -uv.x; // Maintain chirality.
    uv = rot2(-iTime/8.)*uv;
    #endif
    
    
    // Scaling and translation.
    float gSc = 4.;
    vec2 p = uv*gSc - vec2(-1, -.5)*iTime/2.;
    // Smoothing factor.
     float sf = 1./iResolution.y*gSc;
    
    // The pentagon and heptagon tiling.
    vec4 d = distField(p);
    // The individual shape ID.
    float cID = d.w;
    
     
    // Set the background color to white.
    vec3 col = vec3(1);
    
     
    // Use the pixel angle within each individual shape to produce some angular
    // colors, which gives the effect of light bouncing offs of cones.

    // Using the shape ID to set the vertice number.
    float n = cID<3.5? 7. : 5.;
    // Rotate each shape, depending on its ID.
    float oN = 0.;
    if(cID == 1. || cID == 2.) oN = .5;
    if(cID == 4.) oN = .25;
    if(cID == 5.) oN = .75;
    
    // Rotate the shape's local coordinates.
    vec2 q = pL;
    q *= rot2(-oN/n*PI*2.);
    
    // Get the pixel angle.
    float ang = mod(atan(q.x, q.y), 6.2831);
    // Snapping the angle to one of five or seven palette colors.
    float iang = floor(ang*n/(PI*2.))/n;
    // The pentagons aren't nice symmetrical reqular pentagons, so the colored wedges
    // aren't evenly spread out. This is just a quick hack to move a couple of lines.
    if(cID == 5. && n==5. && abs(iang - 4./5.)<.01) iang = floor((ang - .2)*n/(PI*2.))/n;
    if(cID == 5. && n==5. && abs(iang - 4./5.)<.01) iang = floor((ang + .2)*n/(PI*2.))/n;
    if(cID == 4. && n==5. && abs(iang - 1./5.)<.01) iang = floor((ang - .2)*n/(PI*2.))/n;
    if(cID == 4. && n==5. && abs(iang - 1./5.)<.01) iang = floor((ang + .2)*n/(PI*2.))/n;
    
    
    // Utilizing IQ's versatile palette formula to produce some angular colors.
    vec3 lCol = .55 + .45*cos(iang*6.2831 + vec3(0, 1, 2));
    // Flat shading override./
    //lCol = vec3(1);
    //float rnd = hash21(d.yz);
    //lCol = .5 + .45*cos(rnd*6.28 + vec3(1, 2, 3));
    
    
 
    // Producing some dots at the heptagonal vertices, then joining them with
    // the pentagon dots. As an aside, the pentagon vertices where produced 
    // seperatly in the distance function, which is hacky, but it was the best
    // way I could thing of at the time.
    float hDots = 1e5;
    vec2 v0 = rot2(-oN/n*PI*2.)*vec2(0, .5);
    for(int i = 0; i<7; i++){
        if(n == 5.) break;
        hDots = min(hDots, length(pL - v0));
        v0 = rot2(PI*2./float(n))*v0;
    }
    // Combining with the pentagon dots. 
    hDots = min(hDots, pDots);
    
     
    // Outer shape borders with some white dots over the top for dotted lines.
    col = mix(col, vec3(0), (1. - smoothstep(0., sf, abs(d.x) - .01)));
    col = mix(col, vec3(1), (1. - smoothstep(0., sf, hDots - .15)));

 
    // Rendering the outer borders.
    //col = mix(col, vec3(0), (1. - smoothstep(0., sf, d.x + .09 - .035))*.35);
    col = mix(col, vec3(0), (1. - smoothstep(0., sf, d.x + .09)));
    col = mix(col, lCol, (1. - smoothstep(0., sf, d.x + .09 + .05)));
  
    // Rendering the outer dots.
    col = mix(col, vec3(0), 1. - smoothstep(0., sf, hDots - .04));
    // Rings.
    //col = mix(col, vec3(0), 1. - smoothstep(0., sf, abs(hDots - .04) - .02));
   
     
    #ifdef SHOW_GRID
    // Grid to show individual tiles.
    float grid = gridField(p);
    col = mix(col, vec3(0), (1. - smoothstep(0., sf, grid - .025))*.9);
    col = mix(col, vec3(1), (1. - smoothstep(0., sf, grid)));
    #endif

    // Output to screen
    fragColor = vec4(sqrt(max(col, 0.)), 1);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}