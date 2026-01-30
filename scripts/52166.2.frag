#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D renderbuffer;

mat3 g_projection;
bool g_orthogonal;


#define PHI 			((sqrt(5.)+1.)*.5)
#define TAU 			(8.*atan(1.))



#define PLOT_BITS
//#define PLOT_TRAVERSAL
#define PLOT_BASIS
//#define PLOT_SYMMETRY
#define PLOT_VERTEX
#define PRINT_VERTEX_ID
#define PLOT_ENCODING
#define PLOT_AXIS
#define LINE_WIDTH		1.


#define ENCODING_TARGET_VERTEX	(vec3(cos(time*.25), cos(time*.23 + sin(time*.1)), sin(time*.21))*3.)

#define ANIMATE 		false

#define TARGET_RANGE		10.
#define ORTHOGONAL		g_orthogonal
#define VIEW_PROJECTION 	g_projection
#define VIEW_ROTATION_RATE  	(time * .5)
#define VIEW_GIMBLE_FLIP    	(fract(VIEW_ROTATION_RATE) > TAU/4. ? 1. : -1.)
#define VIEW_X 			(normalize(vec3(  PHI, -.001,  .0)) * TARGET_RANGE)
#define VIEW_Y 			(normalize(vec3( .0,   PHI, -.001)) * TARGET_RANGE)
#define VIEW_Z 			(normalize(vec3(.001,   0.,  -PHI)) * TARGET_RANGE)
#define VIEW_FIVE		(normalize(vec3(0., PHI/PHI, PHI)) * TARGET_RANGE)
#define VIEW_SIX		(normalize(vec3(0., PHI*PHI, 1.)) * TARGET_RANGE)
#define VIEW_ROTXZ		VIEW_X //(normalize(vec3(cos(VIEW_ROTATION_RATE), -.125, sin(VIEW_ROTATION_RATE)))*TARGET_RANGE)//vec3(cos(VIEW_ROTATION_RATE), 0., sin(VIEW_ROTATION_RATE))) * TARGET_RANGE)
#define VIEW_ROTXYZ		VIEW_Z //(normalize(vec3(cos(VIEW_ROTATION_RATE), tan(mouse.y*TAU/4.), sin(VIEW_ROTATION_RATE))) * TARGET_RANGE)
#define VIEW_ORBIT  		(normalize(vec3(3.*sin((mouse.x-.5)*2.*TAU), 3.*atan((mouse.y-.5) * TAU)*2., 3.*-cos((mouse.x-.5)*2.*TAU+TAU*.5))) * -TARGET_RANGE) //orbit cam


float binary(float n, float e)
{
	return n/exp2(e+1.);
}


float gray(float n, float e)
{
	return binary(n,e+1.)+.25;
}


float bitmap(float n, float e)
{
	return step(.5,  fract(gray(n, e)));
}


float sprite(float n, vec2 p)
{
	p 		= ceil(p);
	float bounds 	= float(all(bvec2(p.x < 3., p.y < 5.)) && all(bvec2(p.x >= 0., p.y >= 0.)));
	return step(.5, fract(binary(n, (2. - p.x) + 3. * p.y) * bounds));
}

				
float digit(float n, vec2 p)
{	
	     if(n == 0.) { return sprite(31599., p); }
	else if(n == 1.) { return sprite( 9362., p); }
	else if(n == 2.) { return sprite(29671., p); }
	else if(n == 3.) { return sprite(29391., p); }
	else if(n == 4.) { return sprite(23497., p); }
	else if(n == 5.) { return sprite(31183., p); }
	else if(n == 6.) { return sprite(31215., p); }
	else if(n == 7.) { return sprite(29257., p); }
	else if(n == 8.) { return sprite(31727., p); }
	else             { return sprite(31695., p); }
}

				
float print(float n, vec2 position)
{	
	float result = 0.;
	for(int i = 0; i < 8; i++)
	{
		float place = pow(10., float(i));
		
		if(n >= place || i == 0)
		{
			result	 	+= digit(floor(mod(floor(n/place), 10.)), position);		
			position.x	+= 4.;
		}				
	}
	return floor(result+.5);
}


vec3 hsv(in float h, in float s, in float v)
{
    	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}


vec3 rainbow(float hue, float ratio) 
{
    return smoothstep(vec3(0.,0.,0.),vec3(1.,1.,1.),abs(mod(hue + vec3(0.,1.,2.)*(1./ratio),1.)*2.-1.));
}


float contour(float x, float r)
{
	return 1.-clamp(x*x*resolution.x/r*2., 0., 1.);
}



float edge(vec2 p, vec2 a, vec2 b)
{
	vec2 q	= b - a;	
	float u = dot(p - a, q)/dot(q, q);
	u 	= clamp(u, 0., 1.);

	return distance(p, mix(a, b, u));
}


float edge(vec3 p, vec3 a, vec3 b)
{

	vec3 pa = p - a;
	vec3 ba = b - a;
	float h = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.);
	return length(pa - ba * h);
}


float line(vec2 p, vec2 a, vec2 b, float r)
{
	vec2 q	= b - a;	
	float u = dot(p - a, q)/dot(q, q);
	u 	= clamp(u, 0., 1.);

	return contour(edge(p, a, b), r);
}


float exp2fog(vec3 position, vec3 view_origin, float density)
{
	float f = pow(2.71828, distance(position, view_origin) * density);
	return 1./(f * f);
}


mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c, s, -s, c);
}


mat3 projection_matrix(in vec3 origin, in vec3 target) 
{	
	vec3 w          	= normalize(origin-target);
	vec3 u         		= normalize(cross(w,vec3(0.001,1.,0.001)));
	vec3 v          	= normalize(cross(u,w));
	return mat3(u, v, w);
}



vec3 project(vec3 origin, vec3 position)
{
	position 	+= origin;
	position 	*= VIEW_PROJECTION;
	position.z 	= position.z + 1.;	
	position.xy 	*= 1./(ORTHOGONAL ? TARGET_RANGE :  position.z);	
	return position;
}

	
void vertexmap(in float i, out float[6] bit)
{
	i		+= floor(mouse.x*64.);//floor(mouse.x * 7.) * 8.;
	bit[0] 		= bitmap(i, 0.);
	bit[1] 		= bitmap(i, 1.);
	bit[2] 		= bitmap(i, 2.);
	
//	i 		= mod(i, 64.);
	bit[3] 		= bitmap(i, 3.);
	bit[4] 		= bitmap(i, 4.);
	bit[5] 		= bitmap(i, 5.);
}

	
//			color 			*= float(-vertex.x >= 0.); //all red and purple
//			color 			*= float(-vertex.y >= 0.); //all yellow and green
//			color 			*= float(-vertex.z >= 0.); //all teal and blue
void vertexmap(in vec3 v, out float[6] bit, out float i)
{
	bit[0] 		= v.x >= .0 ? 0. : 1.;
	bit[1] 		= v.y >= .0 ? 0. : 1.;
	bit[2] 		= v.z >= .0 ? 0. : 1.;
//	float p 	= PHI;
//	v 		= abs(v);
//	bit[3] 		= v.x < v.y && bit[0] == 1. ? 0. : 1.;
//	bit[4] 		= v.y < v.z && bit[1] == 1. ? 0. : 1.;
//	bit[5] 		= v.z < v.x && bit[2] == 1. ? 0. : 1.;
	
	for(int n = 0; n < 6; n++)
	{
		i 	+= pow(2., float(n)) * bit[n];	
	}
}
	

vec3 h46cube(float[6] bit)
{
	return vec3(bit[0] * PHI - bit[3] * PHI + bit[1] + bit[4], 
		    bit[1] * PHI - bit[4] * PHI + bit[2] + bit[5], 
		    bit[2] * PHI - bit[5] * PHI + bit[0] + bit[3]) - 1.;	
}

vec3 h46cube(float i)
{
	float bit[6];
	
	vertexmap(i, bit);

	return h46cube(bit);
}

float symmetrymap(float i)
{
	float group	= mod(floor(i * .125), 2.) < 1. ? floor(mod(i*.5+1., 2.) + 2.) : floor(mod(i/2.+1., 2.));			
	return mod(i + (group == 0. ? 22. : group == 1. ? 26. : group == 2. ? 38. : 42.), 64.);
}



vec3 plot_axis(vec3 origin, vec2 view, float scale, float line_width)
{
	vec4 v 		= vec4(0., PHI, PHI*PHI, PHI*PHI*PHI);
	
	#define V0 	v.wzx //320
	#define V1 	v.wxy //302
	#define V2 	v.ywx //130
	#define V3 	v.xyw //013
	#define V4 	v.xwz //132
	#define V5 	v.zzz //222
	#define V6 	v.zxw //213 //looking for minium entropy traveral...

	vec3 plot 	= vec3(0., 0., 0.);
	plot.x 		= line(view, vec2(0., 0.), project(origin, vec3(scale, 0., 0.)).xy, line_width);
	plot.y 		= line(view, vec2(0., 0.), project(origin, vec3(0., scale, 0.)).xy, line_width);
	plot.z 		= line(view, vec2(0., 0.), project(origin, vec3(0., 0., scale)).xy, line_width);
	

//	plot.xyz	+= line(view, project(origin, -V0).xy, project(origin, V0).xy, line_width);
//	plot.xyz	+= line(view, project(origin, -V1).xy, project(origin, V1).xy, line_width);
//	plot.xyz	+= line(view, project(origin, -V2).xy, project(origin, V2).xy, line_width);	
//	plot.xyz	+= line(view, project(origin, -V3).xy, project(origin, V3).xy, line_width);	
//	plot.xyz	+= line(view, project(origin, -V4).xy, project(origin, V4).xy, line_width);	
//	plot.xyz	+= line(view, project(origin, -V5).xy, project(origin, V5).xy, line_width);		
//	plot.xyz	+= line(view, project(origin, -V6).xy, project(origin, V6).xy, line_width);			
	plot *= .5;
	return plot;		
}


void main( void ) 
{
	vec2 aspect			= resolution.xy/min(resolution.x, resolution.y);
	vec2 uv 			= gl_FragCoord.xy/resolution.xy;
	
	vec4 buffer			= texture2D(renderbuffer,uv);
	float prior_view		= floor(buffer.w*255.);
	
	vec2 view_layout		= vec2(9., 8.);
	vec2 view_index			= floor(uv * view_layout);
	vec2 mouse_index 		= floor(mouse * view_layout);
	vec2 p				= (fract(uv * view_layout) -.5) * aspect;

	
	
	float selected_view		= view_index.x  == 0. ? view_index.y + 1.:
					  mouse_index.x == 0. ? mouse_index.y + 1.:
				          prior_view;

	ORTHOGONAL			= selected_view > 2.;
	if(view_index.x > 0.)
	{
		p			= (uv - vec2(.535, .5)) * aspect;
		mouse_index.x		= 0.;
	}
	else
	{
		p			+= vec2(.25, 0.);
	}
	
	vec3 view			= normalize(vec3(p, 1.6));
	
	vec3 view_position		= vec3(0., 0., 0.);	
	view_position 			= selected_view == 4. ? VIEW_Z 		: 
				  	  selected_view == 5. ? VIEW_Y 		: 
				 	  selected_view == 6. ? VIEW_X 		: 
				 	  selected_view == 7. ? VIEW_FIVE	: 
				 	  selected_view == 8. ? VIEW_SIX 	: 
				 	  selected_view == 3. ? VIEW_ROTXZ 	: 
				 	  selected_view == 2. ? VIEW_ROTXYZ 	: 
				  	  VIEW_ORBIT;
	
	vec3 origin			= view_position;
	vec3 target			= -origin;
	
	VIEW_PROJECTION			= projection_matrix(origin, target);
	////
	
	
	////plots
	float line_width		= LINE_WIDTH * (view_index.x > 0. ? 2./resolution.x : 18./resolution.x);
	vec3 traversal_plot		= vec3(0., 0., 0.);
	vec3 basis_plot			= vec3(0., 0., 0.);	
	vec3 vertex_plot		= vec3(0., 0., 0.);
	vec3 symmetry_plot		= vec3(0., 0., 0.);
	vec3 vertex_id_print		= vec3(0., 0., 0.);
	vec3 encoding_plot		= vec3(0., 0., 0.);
	vec3 axis_plot			= vec3(0., 0., 0.); 
	float selected_vertex 		= (mouse.x > 1.-1./view_layout.x) ? floor(mouse.y * 64.) : -1.;
	////
	
	#ifdef PLOT_AXIS
	axis_plot			= plot_axis(origin, view.xy, 1., line_width * 2.);
	#endif
	
	#ifdef PLOT_BITS
	float y				= floor(uv.y*64.*aspect.y);	
	float x				= floor((1.-uv.x)*64.*aspect.x);

	
	float bit[6];
	vertexmap(y, bit);
	
	
	float bit_display_mask		= float(x < 6. && x > -1.);
	vec3 bit_plot			= vec3(0.,0., 0.);
	bit_plot			+= x == 0. ? bit[0] : 
					   x == 1. ? bit[1] : 
					   x == 2. ? bit[2] : 
					   x == 3. ? bit[3] : 
					   x == 4. ? bit[4] : 
					             bit[5]; 
	
	bit_plot 			*= .5;
	bit_plot 			-= float(floor(mod(gl_FragCoord.y, resolution.y/64.)) == 0.);
	bit_plot			*= bit_display_mask;
	bit_plot			= max(vec3(0., 0., 0.), bit_plot);
		#ifdef PRINT_VERTEX_ID
		vec2 print_uv		= gl_FragCoord.xy;
		print_uv.x		= mod(print_uv.x, resolution.x/view_layout.x) - (resolution.x/64.) * 3.;
		print_uv.y		= mod(print_uv.y, resolution.y/64.);
	 	print_uv 		= floor(print_uv);
	
		vertex_id_print		+= print(y, print_uv)* float(view_index.x > 7.);
		#endif	
	#endif
	
	
	////enumerate vertices
	vec3 vertex			= vec3(0., 0., 0.);
	vec3 vertex_prior		= vec3(0., 0., 0.);	
	vec3 projected_vertex		= vec3(0., 0., 0.);
	vec3 projected_prior		= vec3(0., 0., 0.);	
	
	#ifdef PLOT_ENCODING
	float encoding_minima		= 9999.;
	float encoding_id		= 0.;
	#endif

	float bits[6];
	for(float i = 0.; i < 64.; i++)
	{		
		vertex			= h46cube(mod(i,64.));
					
		//if(length(vertex) > 1.81)
		{	
			vertex_prior		= vertex;
			projected_prior		= i == 0. ? project(origin, h46cube(63.)) : projected_vertex;
		
			vec3 color		= vec3(0.,0.,0.);
			//color 			= rainbow(floor(i/8.)/8., 5.);		//per byte
//			color 			= rainbow(1.-floor(mod(i,64.))/64.,5.);		//per vertex
//			color 			= hsv(floor(i/8.)/9., 1., .95);			//per byte
			//color 			+= hsv(1.-floor(mod(i,64.))/85., 1., 1.);	//per vertex
			
			
			vertexmap(i, bits);	
			color 			+= 0.;
//			color.x 		= bits[0] * .5; //ray 49 -> 26
//			color.y 		= bits[1] * .5; //ray 19 -> 58
			color.z 		= bits[2] * .5; //ray 39 -> 10

//			color.xy 		+= bits[3] * .5; //ray 45 -> 8
//			color.yz 		+= bits[4] * .5; //ray 43 -> 30
//			color.zx 		+= bits[5] * .5; //ray 41 -> 60	


			//return vec3(bit[0] * PHI - bit[3] * PHI + bit[1] + bit[4], 
		  	//            bit[1] * PHI - bit[4] * PHI + bit[2] + bit[5], 
			//            bit[2] * PHI - bit[5] * PHI + bit[0] + bit[3]) - 1.;
			
			vec3 v 			= h46cube(49.);
//			color.x			+= dot(normalize(vertex), normalize(h46cube(49.)+h46cube(26.))) < 0.  ? 1. : 0.;
//			color.y			+= dot(vertex - h46cube(19.),h46cube(58.)) >= 0. ? 2. : 0.;			
//			color.z			+= dot(vertex - h46cube(39.),h46cube(10.)) >= 0. ? 2. : 0.;						
			
//			color.y			+= dot(normalize(vertex), -normalize(h46cube(19.)-h46cube(58.))) > 0. ? .5 : 0.;			
//			color.z			+= dot(normalize(vertex), -normalize(h46cube(39.)-h46cube(10.))) > 0. ? .5 : 0.;						
//			color.y			+= vertex.x >= 0. ? 1. : 0.;
			
			////planes
//			color.x			= float(abs(vertex.x) == 0.); //16 
//			color.y			= float(abs(vertex.y) == 0.); //16
//			color.z			= float(abs(vertex.z) == 0.); //16
			////

						
			////rhombii
//			color.x			= float(abs(vertex.x) == PHI-1.); //6 
//			color.y			= float(abs(vertex.y) == PHI-1.); //6
//			color.z			= float(abs(vertex.z) == PHI-1.); //6						
			////

			
			////hex prisms
//			color.x			= float(abs(vertex.x) == 1.); //15 
//			color.y			= float(abs(vertex.y) == 1.); //15
//			color.z			= float(abs(vertex.z) == 1.); //15
			////

			////angled faces
//			color.x			+= float(abs(vertex.x) == PHI); //8 
//			color.y			+= float(abs(vertex.y) == PHI); //8
//			color.z			+= float(abs(vertex.z) == PHI); //8
			////

			////axis faces
//			color.x			+= float(abs(vertex.x) == PHI+1.); //8 
//			color.y			+= float(abs(vertex.y) == PHI+1.); //8
//			color.z			+= float(abs(vertex.z) == PHI+1.); //8
			////


//			color 			= length(color) == 0. ? vec3(1., 1., 1.)*.5 : color;
			color 			*= 1.5;
			
//			color	 		+= normalize(vertex)*.5+.5;
//			color			-= bits[0];
			//color 			*= float(vertex.x <= 0.);
			
			
			
			
//			color 			*= float(-vertex.x >= 0.); //all red and purple
//			color 			*= float(-vertex.y >= 0.); //all yellow and green
//			color 			*= float(-vertex.z >= 0.); //all teal and blue
			//color 			*= 0.;
			vec3 target_vertex	= ENCODING_TARGET_VERTEX;
			//color.x 		= float(vertex.x > target_vertex.x);
			
//			color			-= normalize(vertex);
			
			float fog		= (exp2fog(vertex, view_position, .129) * 8.);
			fog			= ORTHOGONAL ?  .35 : max(fog, 0.05);
			
			float width 		= line_width + .01215 * fog;
			projected_vertex	= project(origin, vertex);
		
			#ifdef PLOT_SYMMETRY
			symmetry_plot	= max(symmetry_plot, line(view.xy, projected_vertex.xy, project(origin, h46cube(symmetrymap(i))).xy, width * .5) * color * fog);		
			#endif
		
		
			#ifdef PLOT_VERTEX				
			vertex_plot 	= max(vertex_plot, contour(abs(length(view.xy-projected_vertex.xy)), width * 8. * projected_vertex.z) * color * fog);		
			
			if(selected_vertex == i)
			{
				vertex_plot = max(vertex_plot, contour(abs(length(view.xy-projected_vertex.xy)-.0125), width*.25));		
			}
			#endif 
			
			#ifdef PLOT_BITS			
			bit_plot	*= y == i ? color : vec3(1., 1., 1.);	 
			
			if( selected_vertex == y)
			{				
				bit_plot = bit_plot + .00625 * bit_display_mask;				
			}			
			#endif
			
			#ifdef PLOT_TRAVERSAL
			traversal_plot	= max(traversal_plot, line(view.xy, projected_vertex.xy, projected_prior.xy,  width * 2.) * color * fog);
			#endif
			
			#ifdef PLOT_BASIS
			basis_plot	= max(basis_plot, line(view.xy, vec2(0., 0.), projected_vertex.xy, width * .5) * color * fog); //basis vector
			#endif
			
			#ifdef PRINT_VERTEX_ID
			print_uv	= ceil(.5/resolution+(view.xy - projected_vertex.xy - (vec2(0., 3.))/resolution.x) / (-(TARGET_RANGE/(projected_vertex.z))) * -resolution.y * 1.);
			vertex_id_print	= max(vertex_id_print, print(i, print_uv) * fog * float(length(color) > 0.));
			#endif
			
			
			#ifdef PLOT_ENCODING
			float target_range 	= length(ENCODING_TARGET_VERTEX-vertex);
			encoding_id 		= encoding_minima > target_range ? i : encoding_id;
			encoding_minima 	= min(encoding_minima, target_range);
			#endif
		}
	}
	////
	
	#ifdef PLOT_ENCODING
	vec3 projected_target	= project(origin, ENCODING_TARGET_VERTEX);
	float fog		= (1.-exp2fog(ENCODING_TARGET_VERTEX, view_position, .135) * 8.);
	fog			= max(fog, 0.25);
	encoding_plot 		+= contour(abs(length(view.xy-projected_target.xy)), line_width*32.*projected_target.z) * fog * (normalize(-ENCODING_TARGET_VERTEX)*.5+.5);
	vec3 minima_target	= project(origin, h46cube(encoding_id));
	encoding_plot 		+= contour(abs(length(view.xy-minima_target.xy)), line_width*2.*minima_target.z) * fog * vec3(0., 3., 0.);		
	encoding_plot		+= line(view.xy, project(origin, h46cube(encoding_id)).xy, projected_target.xy,  line_width * 2.) * fog * vec3(0., 3., 0.);
	
	
	float i 		= 0.;
	
	vertexmap(ENCODING_TARGET_VERTEX, bits, i);
	
	vec3 mapped_target	= project(origin, h46cube(bits));
	fog			= (1.-exp2fog(mapped_target, view_position, .135) * 8.);
	fog			= max(fog, 0.25);
	encoding_plot 		+= contour(abs(length(view.xy-mapped_target.xy)), line_width*2.*mapped_target.z) * fog;
	encoding_plot		+= line(view.xy, projected_target.xy, mapped_target.xy,  line_width * 2.) * fog * vec3(1., 0., 0.);
	#endif
	
	vec3 result		= vec3(0., 0., 0.);
	result			+= axis_plot;
	result			+= traversal_plot * 2.;
	result			+= symmetry_plot;
	result			+= basis_plot;
	result			+= vertex_plot;	
	result 			+= bit_plot;
	result 			+= vertex_id_print;
	result 			+= encoding_plot;
	
	gl_FragColor.xyz	= result;
	gl_FragColor.w 		= max(1./256., (selected_view)/256.);
}//sphinx
