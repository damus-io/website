export function Footer() {
    return (<>
        <footer className="flex flex-col items-center justify-center w-full p-8 bg-black">
            <div className="text-sm text-white/50">
                © {new Date().getFullYear()} Damus Nostr Inc.
            </div>
        </footer>
    </>)
}