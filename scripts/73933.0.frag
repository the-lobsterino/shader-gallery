#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

vec2 not_random( vec2 p ) 
{	
	
	vec2 orthogonal = vec2( 0., 0.);
	vec2 hexagonal	= vec2( 1., 0.);
    	vec2 pentagonal = vec2( 1., 1.);
		
	vec2 freeform 	= mouse * 2.;
        vec2 automatic  = vec2(cos(time*pow(2., -3.)), sin(time*pow(2., -4.)));		
  	 
	
	//select basis 
	float mode 	= floor(mod(time * .25, 5.));
//	mode 		= 2.; //hardcoded 
	
	//select mode
	vec2 basis	= mode == 0. ? orthogonal 
			: mode == 1. ? hexagonal
			: mode == 2. ? pentagonal 
			: mode == 3. ? freeform 
			:  	       automatic;	
	
	return mod(p.yx * basis + 1., 2.)/2.;
}

void main() 
{
    vec3 color  = vec3(.0); 
    float scale = 3.;
    vec2 aspect = resolution / min(resolution.x, resolution.y);
    vec2 width =  16. / resolution * aspect;
    
    //coordinates
    vec2 st 	= (gl_FragCoord.xy * 2. - resolution.xy) / resolution.xy * aspect;
    st 		*= scale; //scale multiplier

    // Tile the space
    vec2 i_st 	= floor(st);
    vec2 f_st 	= fract(st);

    //view tiles
//    gl_FragColor = vec4(abs(i_st/2.)/scale, 0., 1.);	return; //tile address (rg = xy)
//    gl_FragColor = vec4(f_st, 0., 1.);	return; //tile interior (rg = xy)

	
	
    //voronoii - test 9 tiles (a center tile, and all 8 neighbors around it) and locate the closest input point from the "not random" function	
    float m_dist = 99999.;         // minimum distance
    vec2 m_diff	 = vec2( 1., 1.);  // minimum difference
    vec2 m_point = vec2( 1., 1.);  // closest point
    for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
	    // Neighbor place in the grid
	    vec2 neighbor = vec2(float(x), float(y));
	    
	    // Random position from current + neighbor place in the grid
	    vec2 point = not_random(i_st + neighbor);

	
	    // Vector between the pixel and the point
	    vec2 diff   = neighbor + point - f_st;
;
	    // Distance to the point
	    float dist  = length(diff);
	       
	    	       
            // Keep the closer distance
	    m_dist 	= min(m_dist, dist);

	    //select point and difference based on distance
	    m_diff  	= m_dist == dist ?  diff : m_diff;
	    m_point	= m_dist == dist ? point : m_point;
        }
    }
	
   
	
    //Draw selected point
    float center    = step(m_dist, .0625);
    color	    += center * .85; 
	 
   if(center == 0.)
   {
      color 	+= normalize(vec3(fract(m_point - .125), .5));
  
      // Show isolines
      color 	+= step(.5, abs(sin(32.0 * m_dist))) * .125;
       
      // Shade gradient	   
      color.xyz	+= sin(atan(-m_diff.y, m_diff.x)) * .25 - .125;
   }	    
	
    // Draw grid
    color.xyz 	+= max(step(1. - width.x, f_st.x), step(1. - width.y, f_st.y)) * .125;


    gl_FragColor = vec4(color,1.0);
}//parent by ??? mods by sphinx 
