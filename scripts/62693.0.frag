/*
 * Original shader from: https://www.shadertoy.com/view/ltX3WH
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
#define time iTime

vec2 uv = vec2(0.); //2D plane
vec3 col = vec3(0.); //Color palette
float movefactor = 0.;

//colors
void col_bg(){col = vec3(0.6,0.7,0.9);} //cyan
void col_leg(){col = vec3(0.8,0.0,0.35);} //magenta
void col_body(){col = vec3(1.0,0.65,0.9);}//pink
void col_hand(){col_body();}//pink
void col_mouth_out(){col = vec3(0.8,0.1,0.1);}//maroon
void col_mouth_in(){col = vec3(1.0,0.3,0.6);}//fuchsia
void col_eye_back(){col = vec3(0.2,0.3,0.9);}//blue
void col_eye_mid(){col = vec3(0.0,0.0,0.0);} //black 
void col_eye_front(){col = vec3(1.0,1.0,1.0);}//white
void col_cheek(){col = vec3(1.0,0.4,0.8);}//rose

void rotate (float deg)
{
	float rad = radians(deg);
	mat2 rotamat = mat2(cos(rad),sin(rad),-sin(rad),cos(rad));
	uv = rotamat * (uv);
}

bool iscircle(float x_center, float y_center, float radius)
{
    bool result = false;
    
    if (sqrt(pow(uv.x - x_center,2.0) + pow(uv.y - y_center,2.0)
            ) < radius
        )result = true;
    
    return result;
}

bool isellipse(float x_center, float y_center, float radius1, float radius2)
{
    bool result = false;
    
    if (sqrt( radius1*pow(uv.x - x_center,2.0) 
             + radius2*pow(uv.y - y_center,2.0)
            ) < radius1 * radius2
        )result = true;
        
    return result;
}
    
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    movefactor = //0.; //set to 0 for a still image
	cos(4.*time)/42.;
    
	uv = fragCoord.xy / iResolution.xy; // get 2d plane
    uv.x *= iResolution.x/iResolution.y; //fix aspect ratio
    uv.x -= 0.88; //move right
    uv.y -= 0.12; //move up
    //uv.x += 0.4; //move left
    //uv.y += 0.4; //move down
    
    ///variables
    
    //body
    float b_radius = 0.28;
    float bx_center = -0.01-movefactor;
    float by_center = 0.6;
    by_center = 1. - by_center;
    
    //legs; l1 - left, l2 - right
    float lx_radius = 0.16;
    float ly_radius = 0.45;
    float l1x_center = -0.21; 
    float l1y_center = 0.85-movefactor; 
    l1y_center = 1.-l1y_center;  
    float l2x_center = 0.22;
    float l2y_center = 0.83+movefactor;
    l2y_center = 1.-l2y_center;
    
    //hands; h1 - left, h2 - right
    float hx_radius = 0.15;
    float hy_radius = 0.35;
    float h1_angle = 140.0; 
    float h1x_center = -0.045;
    float h1y_center = 1.55+movefactor;
    h1y_center = 1.-h1y_center;
    float h2_angle = 30.0;
    float h2x_center = 0.0;
    float h2y_center = 0.45+movefactor; 
    h2y_center = 1.-h2y_center; 
    
    //mouth; m1 - outer, m2 - inner
    float m1x_radius = 0.09+4.*movefactor;
    float m1y_radius = 0.28+1.1*movefactor;
    float m1x_center = 0.0-movefactor;
    float m1y_center = 0.71+1.2*movefactor;
    m1y_center = 1. - m1y_center;
    float m2x_radius = 0.07+4.*movefactor;
    float m2y_radius = 0.2+2.*movefactor;
    float m2x_center = m1x_center;
    float m2y_center = m1y_center - 0.018;
    
    //eyes; e1 - back; e2 - mid; e3 - front
    float e_angle = 90.0;
    float ex_dist = 0.005;
    float ey_dist = 0.16;
    float e1x_radius = 0.06-movefactor/8.;
    float e1y_radius = 0.35+movefactor;
    float e1x_center = -0.47-movefactor/4.;
    float e1y_center = 1.09+movefactor; 
    e1y_center = 1.-e1y_center;
    float e2x_radius = 0.064-movefactor/8.;
    float e2y_radius = 0.28+movefactor;
    float e2x_center = e1x_center - 0.022;
    float e2y_center = e1y_center;
    float e3x_radius = 0.04-movefactor/8.;
    float e3y_radius = 0.2+movefactor;
    float e3x_center = e1x_center - 0.045;
    float e3y_center = e1y_center;
    
    //cheeks; c1 - left, c2 - right
    float cx_dist = 0.385+2.4*movefactor;
    float cy_dist = 0.005;
    float c1_angle = 5.;
    float c2_angle = -5.;
    float cx_radius = 0.045;
    float cy_radius = 0.2;
    float cx_center = -0.2-2.3*movefactor;
    float cy_center = 0.67;
    cy_center = 1. - cy_center;

	col_bg();
    
    ///draw kirby from bottom to top (in layers)!
    
    //legs
    if(isellipse(l1x_center,l1y_center,lx_radius,ly_radius)||
       isellipse(l2x_center,l2y_center,lx_radius,ly_radius)
      ) col_leg();
    
    //body
    if(iscircle(bx_center,by_center,b_radius))
    	col_body();
    
    //left hand
    rotate(h1_angle);
    if(isellipse(h1x_center,h1y_center,hx_radius,hy_radius))
    	col_hand();
    rotate(360. - h1_angle);
    //right hand
    rotate(h2_angle);
    if(isellipse(h2x_center,h2y_center,hx_radius,hy_radius))
    	col_hand();
    rotate(360. - h2_angle);
        
    //outer mouth
    if(isellipse(m1x_center,m1y_center,m1x_radius,m1y_radius))
    	col_mouth_out();
    //inner mouth
    if(isellipse(m2x_center,m2y_center,m2x_radius,m2y_radius))
    	col_mouth_in();
    
    rotate(e_angle);
    //back eye
    if(isellipse(e1x_center+ex_dist,e1y_center,e1x_radius,e1y_radius)
      ||isellipse(e1x_center,e1y_center+ey_dist,e1x_radius,e1y_radius))
    	col_eye_back();
    //mid eye
    if(isellipse(e2x_center+ex_dist,e2y_center,e2x_radius,e2y_radius)
      ||isellipse(e2x_center,e2y_center+ey_dist,e2x_radius,e2y_radius))
    	col_eye_mid();
    //front eye
    if(isellipse(e3x_center+ex_dist,e3y_center,e3x_radius,e3y_radius)
      ||isellipse(e3x_center,e3y_center+ey_dist,e3x_radius,e3y_radius))
    	col_eye_front();
    rotate(360. - e_angle);

    //left cheek
    rotate(c1_angle);
    if(isellipse(cx_center,cy_center,cx_radius,cy_radius))
    	col_cheek();
	rotate(360. - c1_angle);
    //right cheek
    rotate(c2_angle);
    if(isellipse(cx_center+cx_dist,cy_center+cy_dist,cx_radius,cy_radius))
    	col_cheek();
	rotate(360. - c2_angle);

    ///set color output
	fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}