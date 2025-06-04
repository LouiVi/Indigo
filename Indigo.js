function OnStart()
{


	lay = app.CreateLayout( "Linear", "VCenter,FillXY" )
	web= app.CreateWebView( 1, 1 );
	lay.AddChild( web );
	app.AddLayout( lay );
		if(!app.FileExists( app.GetAppPath()+"/path.txt" )) {
		GetPath();
	}else{
	dload_OnDownload(app.GetAppPath()+"/path.txt");
	/*adrs = app.ReadFile( path ) ;
		theme = app.LoadText( "theme", "a", "theme.txt" );
    app.HttpRequest( "GET", adrs.replace("[L]", theme), null, null, handleReply );*/
    
	}
}

function handleReply( error, reply )
{
    if( error ) alert( reply );
    else
    {
    app.WriteFile( "source.html", reply );
    web.LoadHtml( reply,adrs.replace("[L]",theme) );
    }
}

function ChangeTheme(theme)
{
	app.SaveText( "theme", theme, "theme.txt");
	app.ShowPopup("Swithching to theme: " + theme);
	web.Execute("document.getElementById('appURL').value='"+adrs.replace("[L]", theme)+"'");
	app.HttpRequest( "GET", adrs.replace("[L]", theme), null, null, handleReply );
}

function GetPath()
{
    var srcFileUrl = "https://vintage-soft.com/inventario/path.txt";
    var targetDir = app.GetAppPath();
    dload = app.CreateDownloader();
    dload.SetOnComplete( dload_OnComplete );
    dload.SetOnDownload( dload_OnDownload );
    dload.Download( srcFileUrl, targetDir );
}

function dload_OnComplete()
{
    pathDownloaded = true;
}

function dload_OnDownload(path)
{
		adrs = app.ReadFile( path ) ;
		theme = app.LoadText( "theme", "a", "theme.txt" );
    app.HttpRequest( "GET", adrs.replace("[L]", theme), null, null, handleReply );
}