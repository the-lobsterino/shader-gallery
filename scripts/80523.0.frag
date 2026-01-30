#extension GL_OES_standard_derivatives : enable
		float h = map( ro + rd*t ).w
        res = min( res, k*h/t );
        t += clamp( h, 0.003, 0.10 );
        if( res<0.002 || t>tmax ) break;
    }
    return clamp( res, 0.0, 1.0 );
}

float calcOcclusion( in vec3 pos, in vec3 nor ){
	float occ = 0.0;
    float sca = 1.0;
    for( int i=0; i<5; i++ )
    {
        float hr = 0.01 + 0.15*float(i)/4.0;
        vec3 aopos =  nor * hr + pos;
        float dd = map( aopos ).w;
        occ += -(dd-hr)*sca;
        sca *= 0.95;
    }
    return clamp( 1.0 - occ*1.5, 0.0, 1.0 );
}


#define AA 1

void main()
{
    

    vec3 ro = vec3( 0.0, 0.3, 3.0 ); //pos
    vec3 ta = vec3( 0.0, 0.0, 0.0 ); // lookat
    
    // camera matrix
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
    vec3 vv = normalize( cross(uu,ww));
    
    
    vec3 tot = vec3(0.0);
    

    for( int m=0; m<AA; m++ )
    for( int n=0; n<AA; n++ )
    {
     
        }
        
    
        // shading/lighting	
        vec3 col = vec3(0.0);
        if( t<tmax )
        {
            vec3 pos = ro + t*rd;
            vec3 nor = calcNormal(pos);
            vec3 lig = normalize(vec3(10.0,10.0,10.0)); // light pos
            vec3 hal = normalize(lig-rd);
            float dif = clamp( dot(nor,lig), 0.0, 1.0 );
            float occ = calcOcclusion( pos, nor );
            if( dif>0.001 ) dif *= calcSoftshadow( pos+nor*0.001, lig, 0.001, 1.0, 32.0 );
            float spe = pow(clamp(dot(nor,hal),0.0,1.0),16.0)*dif*(0.04+0.96*pow(clamp(1.0-dot(hal,-rd),0.0,1.0),5.0));
            float amb = 0.5 + 0.5*dot(nor,vec3(0.0,1.0,0.0));
            col =  vec3(0.5,1.0,1.2)*amb*occ;
            col += vec3(2.8,2.2,1.8)*dif;
            
            col *= 0.2;
            
            
            col *= 1.0 - smoothstep( 0.01, 5.0, t );
            
            col*= h.rgb;
                        col += vec3(0.5,0.5,0.5)*spe*55.0;

        }

        // gamma        
        col = sqrt( col );
	    tot += col;
    #if AA>1
    }
    tot /= float(AA*AA);
    #endif

	gl_FragColor = vec4( tot, 1.0 );
}}