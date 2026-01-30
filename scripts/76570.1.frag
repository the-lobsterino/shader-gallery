/*
 * Original shader from: https://www.shadertoy.com/view/fl3GR7
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
int modi(int a, int n){
    return a - (n * int(a/n));
}

bool checkin(int x, int y, int w, int h){
    return x>=0&&x<w && y>=0&&y<h; 
}

int pow2(int x){
    return int(pow(2.,float(x)));
}

const int QR_LEN = 29;
int QR[QR_LEN];

void qrLoad(){
    QR[28]=533147263;QR[27]=273053761;QR[26]=391663197;QR[25]=391794013;QR[24]=391099741;QR[23]=273901121;QR[22]=534074751;QR[21]=111104;QR[20]=52090595;QR[19]=229524769;QR[18]=3251061;QR[17]=49859844;QR[16]=282388420;QR[15]=425654187;QR[14]=115532266;QR[13]=364934657;QR[12]=110253038;QR[11]=500794045;QR[10]=309982567;QR[9]=28167609;QR[8]=502435577;QR[7]=52343552;QR[6]=123594111;QR[5]=152679745;QR[4]=335101021;QR[3]=380404317;QR[2]=266967645;QR[1]=383815489;QR[0]=128683391;
}
int qr(const int x,const int y){
    int r = 1;
    if (checkin(x,y, QR_LEN,QR_LEN)){
        for (int i = 0 ; i < QR_LEN ; i++) if (y == i) r = modi( QR[i] / pow2(x) + 1, 2 );
            return 1-r;
    }
}



void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 p2 = fragCoord.xy + vec2(0.5);
	vec2 c = iResolution.xy / 2.0;
	
	//float dist = sceneSmooth(p, 5.0);
	float dist = 1.;
	

	
	vec4 col = vec4(0.9, 0.9, 0.9, 1.0);

	qrLoad();
    ivec2 ir  = ivec2(iResolution.xy); 
    ivec2 ip  = ivec2(fragCoord.xy);
    ivec2 it  = ip*ir.x*1024/ivec2(ir.y)/(ir.y) ;
    it/=58;
    it.x -= 14;
    float qrf = float(1-qr(it.x, it.y-1));
    float t = iTime;
    float t1 = clamp((t-0.)*.2,0.,1.);
    vec2 ar   = vec2( iResolution.x/iResolution.y,1.);
    vec2 uv   = fragCoord/iResolution.xy;
    vec2 p1   = uv*ar;
    col*= (1.-qrf);
    col.xyz *=  1.3*smoothstep(0.,.8, t1*2.-length(p1-.5));
	fragColor = clamp(col, 0.0, 1.0);
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    iMouse = vec4(mouse * resolution, 0., 0.);
    mainImage(gl_FragColor, gl_FragCoord.xy);
}