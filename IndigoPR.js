cfg.Light, cfg.Portrait;
//, cfg.M/UI;
app.LoadPlugin( "Utils" );
function OnStart()
{
	utils = app.CreateUtils();
	app.SetStatusBarColor(  utils.RandomHexColor());
	app.SetNavBarColor( utils.RandomHexColor());
	//app.WriteFile( app.GetAppPath()+"/u.js", utils.GetSource());
	app.ShowProgress( "Loading ...", "Solid");
	lay = app.CreateLayout( "Linear", "VCenter,FillXY" )
	web= app.CreateWebView( 1, 1 );
	lay.AddChild( web );
	app.AddLayout( lay );
	utils.SetTheme(utils.RandomHexColor());
	app.SetStatusBarColor(  utils.RandomHexColor());
	app.SetNavBarColor( utils.RandomHexColor());
	if(!app.FileExists( app.GetAppPath()+"/path.txt" )) {
		GetPath();
	}else{
		dload_OnDownload(app.GetAppPath()+"/path.txt");
	}
}

function handleReply( error, reply )
{
		app.ShowProgress( "Loading ..." );
    if( error ) alert( reply );
    else
    {
    app.WriteFile( "source.html", reply );
    web.LoadHtml( reply,adrs.replace("[L]",theme) );
    }
    app.HideProgress();
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
    app.HideProgress();
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
    app.HideProgress();
}